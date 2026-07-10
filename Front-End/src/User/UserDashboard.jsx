import React, { useState } from 'react'
import '../UserStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, removeSuccess } from '../features/user/userSlice'
import { toast } from 'react-toastify'

const UserDashboard = ({user}) => {
  const {cartItems}=useSelector((state)=>state.cart)
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [menuVisible,setMenuVisible]=useState(false);
  function toggleMenu(){
    setMenuVisible(!menuVisible);
  }
  const options=[
    {name:'Orders',funcName:orders},
    {name:'Account',funcName:profile},
    {name:`Cart (${cartItems.length})`,funcName:myCart},
    {name:'Logout',funcName:logoutUser},
  ]
  if(user.role==='admin'){
    options.unshift({
      name:'Admin Dashboard',funcName:dashboard
    })
  }
  function orders(){
      navigate("/orders/user")
  }
  function profile(){
      navigate("/profile")
  }
  function myCart(){
    navigate("/cart")
  }
  function logoutUser(){
    dispatch(logout())
    .unwrap()
    .then(()=>{
      toast.success('Logout SuccessFul',{position:'top-center',autoClose:1500})
      dispatch(removeSuccess())
      navigate('/login')
    })
    .catch((error)=>{
       toast.success(error.message ||'Logout Failed',{position:'top-center',autoClose:1500})
    })
  }
  function dashboard(){
    navigate('admin/dashboard')
  }
  return (
    <>
    <div className={`overlay ${menuVisible?'show':''}`}  onClick={toggleMenu}></div>
    <div className="dashboard-conttainer">
      <div className="profile-header" onClick={toggleMenu}>
        <img src={user.avatar.url?user.avatar.url:'./Images/avatar.png'} alt="Profile" className='profile-avatar'/>
        <span className="profile-name">{user.name || 'User'}</span>
      </div>
      {menuVisible &&(<div className="menu-options">
        {options.map((item)=>(
          <button className={`menu-option-btn ${item.isCart?(cartItems.length>0?'cart-not-empty':''):''}`} onClick={item.funcName} key={item.name}>{item.name}</button>
        ))}
      </div>)}
    </div>
    </>
  )
}

export default UserDashboard