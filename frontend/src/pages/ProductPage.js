import React, { useEffect, useState } from 'react';
import { Badge, Button, ButtonGroup, Col, Container, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import Loading from '../components/Loading';
import SimilarProduct from '../components/SimilarProduct';
import axios from "../axios";
import "./ProductPage.css";
import { LinkContainer } from 'react-router-bootstrap';
import "react-alice-carousel/lib/alice-carousel.css";
import { useAddToCartMutation } from "../services/appApi";
import ToastMessage from "../components/ToastMessage";

function ProductPage() {

    const { id } = useParams();
    const user = useSelector(state => state.user);
    const [product, setProduct] = useState(null);
    const [siz, setSiz] = useState('');

    const [similar, setSimilar] = useState(null);
    const [addToCart, { isSuccess }] = useAddToCartMutation();

    const handleDragStart = (e) => e.preventDefault();
    const handleSizChange = (event) => {
        setSiz(event.target.value);
    }
    useEffect(() => {
        axios.get(`/products/${id}`).then(({ data }) => {
            setProduct(data.product);
            setSimilar(data.similar);
        });
    }, [id]);

    //const images = product.pictures.map((picture) => <img className="product__carousel--image" src={picture.url} onDragStart={handleDragStart} />);

    if (!product) {
        return <Loading />
    }

    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3 },
    };
    const images = product.pictures.map((picture) => <img className="product__carousel--image" src={picture.url} onDragStart={handleDragStart} />);

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let similarProducts = [];
    if (similar) {
        similarProducts = similar.map((product, idx) => (
            <div className='item' data-value={idx}>
                <SimilarProduct {...product} />
            </div>
        ))
    }

    return (
        <Container className='pt-4' style={{ position: 'relative' }}>
            <Row>
                <Col lg={6}>
                    <AliceCarousel mouseTracking items={images} controlsStrategy='alternate'>

                    </AliceCarousel>
                </Col>
                <Col lg={6} className='pt-4'>
                    <h1>{product.name}</h1>
                    <p>
                        <Badge bg='primary'>{product.category}</Badge>
                    </p>
                    <p className='product__price'>{Number(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} </p>
                    <p className='product__link'>Kho: {numberWithCommas(product.link)} </p>
                    <p style={{ textAlign: 'justify' }} className='py-3'>
                        <strong>Mô tả: </strong> {product.description}
                    </p>
                    <p style={{ textAlign: 'justify' }} className='py-3'>

                        {user && !user.isAdmin && (
                            <label style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                                <strong>Chọn SIZE:</strong>
                                {['S', 'M', 'L', 'XL'].map((size1) => (
                                    <span key={size1}>
                                        <input
                                            style={{ marginLeft: '2vh' }}
                                            type="radio"
                                            value={size1}
                                            checked={siz === size1}
                                            onChange={handleSizChange}
                                        />
                                        <span style={{ marginLeft: '1vh' }}>{size1}</span>
                                    </span>
                                ))}
                            </label>
                        )}
                    </p>
                    {user && !user.isAdmin && (
                        <ButtonGroup style={{ width: '90%' }}>
                            <Button size="lg" style={{ marginTop: '3.5vh', height: '70%', marginLeft: '3.5vh', }} onClick={() => addToCart({ userId: user._id, productId: id, size1: siz, price: product.price, image: product.pictures[0].url })}>
                                Thêm vào giỏ hàng
                            </Button>

                        </ButtonGroup>
                    )}
                    {user && user.isAdmin && (
                        <LinkContainer to={`/product/${product._id}/edit`}>
                            <Button size='lg'>Chỉnh sửa sản phẩm</Button>
                        </LinkContainer>
                    )}
                    {isSuccess && <ToastMessage bg="info" title="Đã thêm sản phẩm" body={`${product.name} đã được thêm vào giỏ hàng.`} />}
                </Col>
            </Row>
            
            {/* <iframe width="560" height="315" src={product.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
            <div className='my-4'>
                <h2>SẢN PHẨM TƯƠNG TỰ</h2>
                <div className='d-flex justify-content-center align-items-center flex-wrap'>
                    <AliceCarousel mouseTracking items={similarProducts} responsive={responsive} controlsStrategy='alternate' />
                </div>
            </div>
        </Container>
    )

}

export default ProductPage
