import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SearchSection from "../SearchSection";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull, getSenderImg } from "../../config/ChatLogics";
import Loader from "../Loader";
import io from "socket.io-client";
import ScrollableFeed from "react-scrollable-feed";


const Dashboard = () => {
    const navigate = useNavigate();
    const {
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();


    const [socketConnected, setSocketConnected] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [sendNewMessage, setSendNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    var selectedChatCompare;
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // console.log(selectedChat?.users, "selectedChart");

    }, [selectedChat])
    const userLogout = () => {
        localStorage.removeItem('user:token');
        localStorage.removeItem('user:detail');
        navigate("/users/sign_in");
    }

    const ENDPOINT = process.env.ENDPOINT;

    console.log("endpoint",ENDPOINT);

    const myChats = async () => {
        try {
            const transferData = {
                "userId": user.id,
            }
            const { data } = await axios.post("https://connectify-backend-2rxn.onrender.com/api/fetchchat", transferData);
            setChats(data);
            // console.log("chatsssdageiwu", data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {

        const newsocket = io("https://connectify-backend-2rxn.onrender.com");
        setSocket(newsocket);
        newsocket.emit("setup", user);
        newsocket.on('connected', () => setSocketConnected(true));

    }, [])
    useEffect(() => {
        if (socket) {
            socket.on("message received", (newMessageReceived) => {
                if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                    // give notification
                } else {
                    setMessages(prevMessages => [...prevMessages, newMessageReceived])
                    console.log("congratssss", "g-", newMessageReceived, messages);
                }
            });

        }
    })

    const ShowChat = ({ otherUserInfo }) => {


        return (

            <>
                <div className="w-[75%] bg-secondary h-[80px] my-4 rounded-full flex items-center px-14 py-2 border-b">
                    <div className="cursor-pointer">
                        <img src={otherUserInfo?.pic} alt="" className="min-w-[3.5rem] w-[3.5rem] rounded-full " />
                    </div>
                    <div className="ml-6 mr-auto">
                        <h3 className="text-lg font-semibold">
                            {otherUserInfo?.fullName}
                        </h3>

                    </div>
                    <div className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                            <path d="M15 9l5 -5" />
                            <path d="M16 4l4 0l0 4" />
                        </svg>
                    </div>
                </div>
                <div className="h-full border w-full overflow-y-scroll px-10 pb-14 pt-6">
                    <ScrollableFeed >
                        {messages && messages?.map((message) => (
                            <div key={message?._id} className={`max-w-[60%]  ${message?.sender?._id === user?.id ? " bg-primary rounded-tl-xl ml-auto text-white" : "bg-secondary rounded-tr-xl"}  rounded-b-xl  p-4 mb-6`}>
                                {message?.content}
                            </div>
                        ))}

                    </ScrollableFeed>
                </div>

            </>
        )
    }
    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setChatLoading(true);
            const { data, status } = await axios.get(`https://connectify-backend-2rxn.onrender.com/api/message/${selectedChat._id}`);
            console.log("messaaaaaaaages", data)
            if (status === 200 && Array.isArray(data)) {
                setMessages(data);
            } else {
                setMessages([]);
                console.error("Unexpected API response:", data);
            }

            setChatLoading(false);
            console.log("loooo", data);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            console.log(error);
        }
    }
    const sendMessageFunc = async () => {
        try {
            // console.log(selectedChat);
            const sendData = {
                "senderId": user.id,
                "chatId": selectedChat._id,
                "content": sendNewMessage
            }
            setSendNewMessage("");
            const { data } = await axios.post("https://connectify-backend-2rxn.onrender.com/api/message", sendData);
            console.log(data, "heyyy");
            socket.emit("new message", data);
            setMessages([...messages, data]);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const isLoggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        if (!isLoggedInUser) {
            navigate("/users/sign_in");
        }

        myChats();



    }, [])






    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    // console.log(chats, 'userdetails');

    return (
        <div className="w-screen flex">
            <div className="w-[30%] border h-screen bg-secondary flex flex-col ">
                <div className="flex items-center justify-center my-8 md:flex-row flex-col">
                    <img src={user?.imageUrl} alt="" className="rounded-full w-[20%] min-w-[4rem] cursor-pointer" />
                    <div className="ml-8">
                        <h3 className=" text-2xl">{user?.fullName}</h3>
                        <p className="text-lg font-light">My Account</p>
                        <p className="text-primary font-semibold cursor-pointer" onClick={() => userLogout()}>Logout</p>
                    </div>

                </div>
                <div className="w-full h-[0.3rem] bg-[#fff] mb-[1rem]"></div>


                <div className="flex flex-col gap-[0.2rem]">
                    {chats?.map((chat) => (
                        <>
                            <div className={`bg-${selectedChat === chat ? "primary" : "[#E8E8E8]"} ${selectedChat === chat ? "" : "hover:bg-blue-100 hover:text-black"} flex md:flex-row md:gap-[2rem] flex-col gap-[0.5rem] pl-[2rem] items-center cursor-pointer  text-${selectedChat === chat ? "white" : "black"} px-2 py-3 rounded-lg`} key={chat._id} onClick={() => setSelectedChat(chat)}   >
                                <img src={!chat.isGroupChat ? getSenderImg(user.id, chat.users) : chat.chatName} alt="userImage" className="rounded-full w-[3.5rem]" />
                                <h3 className="font-semibold text-[1.1rem] text-center">{!chat.isGroupChat ? getSender(user.id, chat.users) : chat.chatName}</h3>
                            </div>
                            <div className="w-full h-[0.15rem] bg-[#fff] mb-[1rem]"></div>


                        </>
                    ))
                    }
                </div >


            </div>
            <div className="w-[75%] border h-screen bg-white flex flex-col items-center">
                {selectedChat ? (
                    <>
                        {chatLoading ? (<div className="h-[100%] w-[100%] flex items-center justify-center"><Loader /></div>) : (<>
                            <ShowChat otherUserInfo={getSenderFull(user.id, selectedChat.users)} />

                            <div className="w-full flex gap-[1rem]">
                                <input
                                    type="text"

                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[85%] ml-[2rem] my-[1.2rem] outline-none border-none px-6 py-4 '
                                    placeholder="Enter your text"
                                    value={sendNewMessage}
                                    onChange={(e) => setSendNewMessage(e.target.value)}


                                />

                                <div className="flex items-center justify-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => sendMessageFunc()} className="icon icon-tabler icon-tabler-send cursor-pointer" width="34" height="34" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M10 14l11 -11" />
                                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                                    </svg>
                                </div>

                            </div>
                        </>)}

                    </>

                ) : (<>
                    <div className="h-screen flex  items-center justify-center">

                        <h3 className="font-semibold">Select a user to start conversation.</h3>
                    </div>
                </>)}
            </div >
            <div className="w-[20%] border h-screen md:block hidden">
                <h3 className="text-[1.5rem] font-bold text-center mt-[1rem]">Search Users:</h3>
                <SearchSection />
                {/* <h3 className="text-[1.5rem] font-bold text-center mt-[1rem]">Create Group:</h3> */}
            </div>
        </div >

    )
}

export default Dashboard