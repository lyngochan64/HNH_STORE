import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from 'react';
import { Alert, Col, Container, Button, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import CheckoutForm from "../components/CheckoutForm";
import { useIncreaseCartProductMutation, useDecreaseCartProductMutation, useRemoveFromCartMutation } from "../services/appApi";
import "./CartPage.css";
import "./Pay.css";
import { Link } from 'react-router-dom';
const stripePromise = loadStripe("pk_test_51MYiaCKydbzrrZTpRHvXIvavgfGYjIJVrc4tibrs6KhpT9jnloPfPWy3z7nKhqe8cuIxUbUmLAvbURHkzL3F359Z00QnEMrsUv");

function CartPage() {


    const user = useSelector((state) => state.user);
    const products = useSelector((state) => state.products);
    const userCartObj = user.cart;
    let cart = products.filter((product) => userCartObj[product._id] != null);
    const [increaseCart] = useIncreaseCartProductMutation();
    const [decreaseCart] = useDecreaseCartProductMutation();
    const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();
    const [siz, setSiz] = useState('');

    function handleDecrease(product) {
        const quantity = user.cart[product.productId];
        if (quantity <= 0) return alert("Can't proceed");
        decreaseCart(product);
    }

    console.log('cart', cart)

    return (
        <>

            <div className="pt-3 category-banner-container">

                <h1 className="text-center">Thanh toán</h1>
            </div>







            <Container style={{ minHeight: "60vh", paddingTop: "20px", width: "130vh" }} className="cart-container">


                <Row>
                    <Col>
                        {cart.length == 0 ? (
                            <Alert variant="info">Giỏ hàng trống. Hãy thêm sản phẩm vào giỏ hàng của bạn</Alert>
                        ) : (
                            <Elements stripe={stripePromise}>
                                <CheckoutForm />
                            </Elements>
                        )}

                    </Col>

                    <Col>

                        <div className="checkout__cart">
                            <h6>
                                Số lượng: <span> {user.cart.count} sản phẩm</span>
                            </h6>
                            <h6>
                                Giá: <span>  {Number(user.cart.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            </h6>
                            <h6>
                                <span>
                                    Phí vận chuyển:
                                </span>
                                <span>{Number(30000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            </h6>

                            <h4>
                                Tổng chi phí: <span> {Number(user.cart.total + 30000 ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            </h4>
                        </div>

                    </Col>









                </Row>
            </Container>
        </>
    );
}

export default CartPage;



