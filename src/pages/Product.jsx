import React, { useContext } from 'react';
import { ShopContext } from '../components/Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrums/Breadcrums';
import ProductDisplay from '../components/Productdisplay/Productdisplay';
import Descriptionbox from '../components/DescriptionBox/Descriptionbox';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((e) => e.id === Number(productId));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <Descriptionbox />
    </div>
  );
};

export default Product;
