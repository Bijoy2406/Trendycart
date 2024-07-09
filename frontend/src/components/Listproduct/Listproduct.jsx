import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Listproduct.css'
import cross_icon from '../../components/Assets/cross_icon.png'
const Listproduct = () => {

    const [allproducts,setAllProducts] = useState([]);

    const fetchInfo = async ()=>{
      await fetch('http://localhost:4001/allproducts')
      .then((res)=>res.json())
      .then((data)=> {setAllProducts(data)});
    }

    const navigate = useNavigate();

    useEffect(()=>{
      fetchInfo();
    },[])

    const remove_product = async(id)=>{
      await fetch('http://localhost:4001/remove',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({id:id})
      })
      await fetchInfo();
    }
    const goBack = () => {
      navigate('/admin'); // Navigate back to the Admin component
  };


  return (
    <div className='listproduct'>
      <button onClick={goBack} className='addproduct-back-btn'>Back</button>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old price</p>
          <p>New price</p>
          <p>Category</p>
          <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allproducts.map((product,index)=>{
            return <>
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={product.image } alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>৳{product.old_price}</p>
              <p>৳{product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
            </div>
            <hr />
            </>
          })}
        </div>
        </div>
  )
}

export default Listproduct