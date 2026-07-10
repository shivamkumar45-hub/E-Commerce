import React, { useEffect, useState } from 'react'
import '../componentStyles/ImageSlider.css'
const images=["./Images/Image1.jpg","./Images/image2.jpg","./Images/image3.jpg","./Images/image4.jpg"];

const ImageSlider = () => {
  const [currentIndex,setCurrentIndex]=useState(0);
  useEffect(()=>{
    const interval=setInterval(()=>{
      setCurrentIndex((prevIndex)=>(prevIndex+1)%images.length);
    },3000);
    return ()=>clearInterval(interval);
  },[])
  return (
    <div className="image-slider-container">
      <div className="slider-images" style={{transform:`translateX(-${currentIndex * 100}%)`}}>
        {images.map((image,index)=>(<div className="slider-item" key={index}>
          <img src={image} alt={`Slide ${index + 1}`} />
        </div>))}
      </div>
      <div className="slider-dots">
        {images.map((_, index)=><span className={`dot ${index === currentIndex ? 'active' : ''}`} key={index} onClick={()=>setCurrentIndex(index)}/>)}
      </div>
    </div>
  )
}

export default ImageSlider