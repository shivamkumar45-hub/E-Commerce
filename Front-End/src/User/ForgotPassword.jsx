import React, { useEffect, useState } from 'react'
import "../UserStyles/Form.css"
import PageTitle from '../Components/PageTitle'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { forgotPassword, removeErrors, removeSuccess } from '../features/user/userSlice'
import { toast } from 'react-toastify'
import Loader from '../Components/Loader'

const ForgotPassword = () => {
  const {loading,error,message,success}=useSelector(state=>state.user)
  const [email,setEmail]=useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const forgotPasswordEmail=(e)=>{
    e.preventDefault();
    const myForm=new FormData();
    myForm.set('email',email);
    dispatch(forgotPassword(myForm)) 
    setEmail("");
  }
  useEffect(()=>{
      if(error){
        toast.error(error?.message||error,{position:'top-center',autoClose:2000});
        dispatch(removeErrors())
      }
    },[dispatch,error])
     useEffect(()=>{
        if(success){
          toast.success(message,{position:'top-center',autoClose:2000});
          dispatch(removeSuccess())
        }
      },[dispatch,success])
  return (
    <>
    {loading?(<Loader/>):(<>
    <PageTitle title="Forgot Password"/>
    <Navbar/>
    <div className="container forgot-container">
     <div className="form-content email-group">
      <form className="form" onSubmit={forgotPasswordEmail}>
      <h2>Forgot Password</h2>
      <div className="input-group">
        <input type="email" placeholder='Enter Registered Email' name='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
      </div>
      <button className="authBtn">Send</button>
     </form>
     </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default ForgotPassword