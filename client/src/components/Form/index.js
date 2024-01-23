import { useState } from "react"
import Button from "../Button"
import Input from "../Input"
import { useNavigate } from "react-router-dom"

const Form = ({
    isSignInPage = false,
}) => {
    const navigate=useNavigate();
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: ''
        }),
        email: '',
        password: ''
    })
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const res=await fetch(`https://connectify-backend-2rxn.onrender.com/api/${isSignInPage?'login':'register'}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        const resData=await res.json();
        console.log('Data received',resData);

    }
    return (
        <div className="bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col items-center justify-center">
            <div className="text-4xl font-extrabold">Welcome {isSignInPage && 'Back'}</div>
            <div className="text-xl font-light mb-8">{isSignInPage ? "SignIn To get Explored." : "Sign up now to get started."}</div>
            <form className='flex flex-col items-center justify-center w-full ' onSubmit={(e) => handleSubmit(e)}>

                {!isSignInPage && <Input label="Full Name" name="name" placeholder="Enter your full name" type="text" className="mb-6" value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} />}
                <Input label="Email Address" name="email" placeholder="Enter your email" className="mb-6" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                <Input label="Password" name="password" placeholder="Enter your password" type="password" className="mb-6" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                <Button label={isSignInPage ? "Sign In" : "Sign up"} className="w-[25%] cursor-pointer" type="submit"  onClick={(e)=>handleSubmit(e)}/>
            </form>

            <div>
                {isSignInPage ? "Don't have an account" : "Already have an account?"} <span className="text-primary cursor-pointer underline" onClick={()=>navigate(`/users/${isSignInPage?'sign_up':'sign_in'}`)}>{isSignInPage ? "Sign Up" : "Sign In"}</span>
            </div>
        </div>
    )
}

export default Form