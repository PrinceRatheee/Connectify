import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"

const SignIn = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
       
        email: "",
        password: "",
    });
    useEffect(() => {
      
        const isLoggedInUser=localStorage.getItem('user:token');
        if(isLoggedInUser){
            navigate('/');
        }
      
    }, [])
    
    const onSignin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.ENDPOINT}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const resData = await res.json();
            console.log("userhgjhj")
            console.log('Data received', resData);
            if(resData.status===200 && resData.token){
                localStorage.setItem('user:token',resData.token);
                localStorage.setItem('user:detail',JSON.stringify(resData.user));
                navigate('/');
            }
            else{
                toast.error(resData.message);
            }
        } catch (error) {
            // console.log("jhgdjsjfd");
            console.log(error);
        }


    }
    return (
        <>
            <div className="bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col items-center justify-center">
                <div>
                    <h1 className="text-4xl font-extrabold">
                        Login Your Account
                    </h1>

                </div>
                <div className="text-xl font-light mb-8">Sign in  to get explored.</div>
                
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
                    <button type="submit"
                        className="text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center"
                        onClick={(e) => onSignin(e)}
                    >
                        Login
                    </button>
                </div>
                <div className="flex mt-[1rem] gap-[0.2rem]">
                    <h2>New User?</h2>
                    <h2 className="text-primary font-semibold cursor-pointer" onClick={()=>navigate("/users/sign_up")}>Register Here</h2>
                </div>
            </div>
        </>
    )
}

export default SignIn