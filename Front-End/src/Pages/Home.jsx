import React, { useEffect } from 'react'
import Footer from '../Components/Footer'
import '../pageStyles/Home.css'
import Navbar from '../Components/Navbar'
import ImageSlider from '../Components/ImageSlider'
import Product from '../Components/Product'
import PageTitle from '../Components/PageTitle'
import {useDispatch, useSelector} from 'react-redux'
import { getProduct, removeErrors } from '../features/products/productSlice'
import Loader from '../Components/Loader'
import { toast } from 'react-toastify'

const Home = () => {
    const {error,loading,productCount,products} = useSelector((state)=>state.product);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getProduct({keyword:''}))
    },[dispatch])
    useEffect(()=>{
      if(error){
        toast.error(error.message,{position:'top-center',autoClose:2000});
        dispatch(removeErrors())
      }
    },[dispatch,error])
  return (
    <>
   {loading ? (<Loader />) :( <>
    <PageTitle title="Home" />
    <Navbar />
    <ImageSlider />
    <div className="home-container">
      <div className="home-heading">
        <h3>Trending Now</h3>
        <div className="home-product-container">
          {products.map((product,index)=>
            <Product product={product} key={index} />
          )}
        </div>
      </div>
      <Footer />
    </div>
    </>)}
    </>
  )
}

export default Home