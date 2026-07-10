import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import PageTitle from '../Components/PageTitle'
import '../AdminStyles/UsersList.css'
import Footer from '../Components/Footer'
import { Delete, Edit } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, deleteUser, fetchUsers, removeErrors } from '../features/admin/adminSlice'
import Loader from '../Components/Loader'
import { toast } from 'react-toastify'

const UsersList = () => {
  const {users,loading,error,message}=useSelector(state=>state.admin);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  useEffect(()=>{
    dispatch(fetchUsers())
  },[dispatch])
  const handleDelete=(userId)=>{
    const confirm=window.confirm('Are you sure you want to delete this User?')
    if(confirm){
      dispatch(deleteUser(userId))
    }
  }
  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000})
      dispatch(removeErrors())
    }
    if(message){
       toast.success(message,{position:'top-center',autoClose:2000})
      dispatch(clearMessage())
      navigate('/admin/dashboard')
    }
  },[dispatch,error,message])
  return (
    <>
    {loading?(<Loader/>):(<>
    <Navbar/>
    <PageTitle title="All Users"/>
     <div className="usersList-container">
      <h1 className="usersList-title">All Users</h1>
      <div className="usersList-table-container">
        <table className="usersList-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
           {users.map((item,index)=>( <tr key={users._id}>
              <td>{index+1}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/admin/user/${item._id}`} className='action-icon edit-icon'><Edit/></Link>
                <button className="action-icon delete-icon" onClick={()=>handleDelete(item._id)}><Delete/></button>
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
     </div>
    <Footer/>
    </>)}
    </>
  )
}

export default UsersList