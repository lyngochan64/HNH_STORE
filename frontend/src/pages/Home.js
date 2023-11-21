import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from "react-router-bootstrap";
import categories from '../categories';
import './Home.css';
import axios from '../axios';
import {useDispatch, useSelector} from 'react-redux';
import { updateProducts } from '../features/productSlice';
import ProductPreview from '../components/ProductPreview';

function Home() {

  const dispatch = useDispatch();
  const products = useSelector(state => state.products); // Danh sach san pham
  const lastProducts = products.slice(0, 8);
  console.log(lastProducts);

  useEffect(() => {
    axios.get('/products').then(({data}) => dispatch(updateProducts(data)));
  }, [])

  return (
    <div>
      
      {/* <img src="https://uphinh.vn/images/2023/02/18/61d9a0f057f63a774bb7b6cb67f8f863.png" className="home-banner"/> */}
      {/* <img src="https://i.imgur.com/LAoXDuf.png" className="home-banner"/> */}
      <img src="https://i.imgur.com/eLFbfS1.png" className="home-banner"/>
      
      <div className="featured-products-container container mt-4">
        <h2>SẢN PHẨM NỔI BẬT</h2>

        <div className='d-flex justify-content-center flex-wrap' >
          {lastProducts.map((product) => (
            <ProductPreview {...product} />
          ))}
        </div>
        
        <div>
        <Link to="/category/all" style={{ textAlign: "right", display: "block", textDecoration: "none" }}>
          XEM TẤT CẢ {">>"}
        </Link>
        </div>
      </div>
      {/* sale banner */}
      <div className="sale__banner--container mt-4">
        {/* <img src="https://res.cloudinary.com/learn-code-10/image/upload/v1654093280/xkia6f13xxlk5xvvb5ed.png" /> */}
        
        {/* <img  src="https://imgur.com/gR3TzH5.png" /> */}
        <img  src="https://i.imgur.com/uE1DBxv.png" />
      </div>
      <div className="recent-products-container container mt-4">
        <h2>LOẠI SẢN PHẨM</h2>
        {/* <h3 className='h'>THỜI TRANG NAM</h3> */}
        <Row>
          {categories.map((category) => (
            <LinkContainer to={`/category/${category.name.toLocaleLowerCase()}`}>
              <Col md={4}>
                <div style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`, gap: "10px" }} className="category-tile">
                  {category.name}
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </div>
    </div>
    
  )
}

export default Home
