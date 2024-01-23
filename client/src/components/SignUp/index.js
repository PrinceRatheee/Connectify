import React, { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
const SignUp = () => {
    const navigate = useNavigate();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",

    });
    useEffect(() => {
      
        const isLoggedInUser=localStorage.getItem('user:token');
        if(isLoggedInUser){
            navigate('/');
        }
      
    }, [])
    const onSignup = async (e) => {
        e.preventDefault();
        try {
            console.log("pic sent", pic);
            const data = { user, pic };
            const res = await fetch(`${process.env.ENDPOINT}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const resData = await res.json();
            
            if (resData.status === 200) {

                navigate("/users/sign_in");
            }
            else {
                toast.error(resData.message);
            }
        } catch (error) {
           
            console.log(error);
        }


    }
    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "piyushproj");
            fetch(process.env.CLOUDINARY_URL, {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString(), "image url");
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    };
    return (
        <>
            <div className="bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col items-center justify-center">

                <div>
                    <h1 className="text-4xl font-extrabold">
                        Create Your Account
                    </h1>

                </div>
                <div className="text-xl font-light mb-8">Sign up now to get started.</div>
                <div className="flex flex-col mb-[1rem]">
                    <h2 className="merriweather-font font-bold text-[1rem]">Full Name</h2>
                    <input
                        type="text"
                        className="border-2 border-zinc-300  px-[1rem] py-[0.6rem] "
                        value={user.fullName}
                        id="fullName"

                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    />
                </div>
                <div className="flex flex-col mb-[1rem]">
                    <h2 className="merriweather-font font-bold text-[1rem]">Email Id</h2>
                    <input
                        type="text"
                        className="border-2 border-zinc-300  px-[1rem] py-[0.6rem]  "
                        value={user.email}
                        id="email"

                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                </div>
                <div className="flex flex-col mb-[1rem]">
                    <h2 className="merriweather-font font-bold text-[1rem]">Password</h2>
                    <input
                        type="password"
                        className="border-2 border-zinc-300   px-[1rem] py-[0.6rem] "
                        id="password"
                        value={user.password}

                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </div>
                <div>
                    <h2 className="merriweather-font font-bold text-[1rem] mb-[0.5rem]">Upload Your Image </h2>

                    <input
                        type="file"
                        p={1.5}
                        accept="image/*"
                        className="mb-[0.5rem]"
                        onChange={(e) => postDetails(e.target.files[0])}
                    />
                </div>


                <div>
                    {!picLoading &&
                        <button type="submit"
                            className="text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center"
                            onClick={(e) => onSignup(e)} isLoading={picLoading}
                        >
                            SignUp
                        </button>}
                    {picLoading && <>
                        <TailSpin
                            height="50"
                            width="50"
                            color="#1476ff"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                        <h3 className="text-center">Image is Uploading</h3>
                    </>}
                </div>
            </div>
        </>
    )
}

export default SignUp