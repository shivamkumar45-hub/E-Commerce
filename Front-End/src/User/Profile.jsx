import React, { useEffect } from 'react'
import '../UserStyles/Profile.css'
import PageTitle from "../Components/PageTitle";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../Components/Loader';

const Profile = () => {
  const {loading,isAuthenticated,user}=useSelector(state=>state.user);
  const navigate=useNavigate();
  useEffect(()=>{
    if(isAuthenticated===false){
      navigate("/login")
    }
  },[isAuthenticated])
  return (
    <>
    {loading?(<Loader/>):(<div className="profile-container">
      <PageTitle title={`${user.name} profile`}/>
      <div className="profile-image">
        <h1 className="profile-heading">My Profile</h1>
        <img src={user.avatar.url?user.avatar.url:'./Images/avatar.png'} alt="User Profile" className='profile-image' />
        <Link to="/profile/update">Edit Profile</Link>
      </div>
      <div className="profile-details">
        <div className="profile-detail">
          <h2>UserName:</h2>
          <p>{user.name}</p>
        </div>
        <div className="profile-detail">
          <h2>Email:</h2>
          <p>{user.email}</p>
        </div>
        <div className="profile-detail">
          <h2>Joined On:</h2>
          <p>{user.createdAt?String(user.createdAt).substring(0,10):'N/A'}</p>
        </div>
      </div>
      <div className="profile-buttons">
        <Link to='/orders/user'>My Orders</Link>
        <Link to='/password/update'>Change Password</Link>
      </div>
    </div>)}
    </>
  )
}

export default Profile