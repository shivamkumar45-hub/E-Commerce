import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, removeErrors, removeSuccess } from '../features/user/userSlice'
import { toast } from 'react-toastify'

const Login = () => {
  const [loginEmail,setLoginEmail]=useState("")
  const [loginPassword,setLoginPassword]=useState("")
  const {error,success,loading,isAuthenticated}=useSelector(state=>state.user);
  
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const redirect=new URLSearchParams(location.search).get('redirect')||"/";

  const loginSubmit=(e)=>{
    e.preventDefault();
    dispatch(login({email:loginEmail,password:loginPassword}))
  }

  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000});
      dispatch(removeErrors())
    }
  },[dispatch,error])

  useEffect(()=>{
    if(isAuthenticated){
       navigate(redirect)
    }
  },[isAuthenticated])

  useEffect(()=>{
    if(success){
      toast.success("login successful",{position:'top-center',autoClose:2000})
      dispatch(removeSuccess())
    }
  },[dispatch,success])

  return (
    <div className="form-container container">
      <div className="form-content">
        <form  className="form" onSubmit={loginSubmit}>
          <div className="input-group">
            <input type="email" placeholder='Email' value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)}/>
          </div>
          <div className="input-group">
            <input type="password" placeholder='Password' value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)}/>
          </div>
          <button className="authBtn">Sign In</button>
          <p className="form-links">Forgot Your Password?<Link to="/password/forgot">Reset Here</Link></p>
          <p className="form-links">Don't Have Account<Link to="/register">Sign Up Here</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login