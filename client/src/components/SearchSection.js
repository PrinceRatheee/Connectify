import { useState } from "react"
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "./Loader";
import { ChatState } from "../context/ChatProvider";
const SearchSection = () => {

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const {
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const searchUser = async () => {
    if (!searchText) {
      toast.error("Enter the name in search bar");

    }
    setSearchLoading(true);
    const userId = {
      "userId": user.id,
    };
    const { data } = await axios.post(`https://connectify-backend-2rxn.onrender.com/api/user?search=${searchText}`, userId);
 
    setSearchResult(data);
    setSearchLoading(false);
  }
  const accessChat=async(userId)=>{
    try {
    
      setSearchLoading(true);

      const datatransfer = {
        "userId": userId,
        "senderId":user.id

      };
      const {data}=await axios.post(`${process.env.ENDPOINT}/api/chat`,datatransfer);
      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);
      
      setSearchLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex justify-center mt-[1rem] gap-[1rem] mx-[1rem] ">

        <input type="text" placeholder="Enter name" className="px-4 py-2 w-[80%] min-w-[5rem] rounded-lg" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        <button className="bg-gray-200 px-[1rem] py-[0.5rem] cursor-pointer rounded-md" onClick={() => searchUser()}>Search</button>

      </div>
      <div className="overflow-y-scroll">
      {searchLoading ?  <> <div className="mt-[10rem] ml-[6rem]"><Loader /></div></> : <>
        <div className="flex flex-col gap-[1rem] items-center mt-[1.5rem] ">
          {searchResult?.map((result) => (

            <>
            
              <div className="flex gap-[0.5rem] cursor-pointer " onClick={()=>accessChat(result._id)}>
                <img src={result.pic} alt="" className="w-[4rem] rounded-full" />
                <div className="flex flex-col">

                  <h3 className="text-[1.2rem]">{result.fullName}</h3>
                  <h3><span className="font-semibold">email: </span>{result?.email}</h3>
                </div>
              </div>
              <div className="w-[100%] h-[0.1rem] bg-secondary"></div>
            </>
          ))}
        </div>
      
      </>
      

      }
      </div>
    </>
  )
}

export default SearchSection