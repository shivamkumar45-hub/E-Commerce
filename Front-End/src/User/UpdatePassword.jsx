import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import PageTitle from '../Components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeErrors, removeSuccess, updateUserPassword } from '../features/user/userSlice'
import { toast } from 'react-toastify'
import Loader from '../Components/Loader'

const UpdatePassword = () => {
  const {success,loading,error}=useSelector(state=>state.user)
  const dispatch=useDispatch(); 
  const navigate=useNavigate();
  const [oldPassword,setOldPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
  const updatePasswordSubmit=(e)=>{
    e.preventDefault();
    const myForm=new FormData();
    myForm.set('oldPassword',oldPassword)
    myForm.set('newPassword',newPassword)
    myForm.set('confirmPassword',confirmPassword)
    dispatch(updateUserPassword(myForm))
  }
  useEffect(()=>{
    if(error){
      toast.error(error?.message||error,{position:'top-center',autoClose:2000});
      dispatch(removeErrors())
    }
  },[dispatch,error])
  useEffect(()=>{
    if(success){
      toast.success("Password Updated successfully",{position:'top-center',autoClose:2000});
      dispatch(removeSuccess())
      navigate("/profile")
    }
  },[dispatch,success])
  return (
    <>
    {loading?(<Loader/>):(<>
    <Navbar/>
    <PageTitle title="Password Update"/>
    <div className="container update-container">
      <div className="form-content">
        <form className="form" onSubmit={updatePasswordSubmit}>
          <h2>Update Password</h2>
          <div className="input-group">
            <input type="password" name='oldPassword' placeholder='Old Password' value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
          </div>
          <div className="input-group">
            <input type="password" name='newPassword' placeholder='New Password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
          </div>
          <div className="input-group">
            <input type="password" name='confirmPassword' placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
          </div>
          <button className="authBtn">Update Password</button>
        </form>
      </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default UpdatePassword