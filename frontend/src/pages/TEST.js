

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from 'react';
import { Alert, Col, Button, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import CheckoutForm from "../components/CheckoutForm";
import { useIncreaseCartProductMutation, useDecreaseCartProductMutation, useRemoveFromCartMutation } from "../services/appApi";
import "./CartPage.css";
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
        <Container style={{ minHeight: "95vh" }} className="cart-container">
            <Row>
                <Col>
                    {/* <h1 className="pt-2 h3">Giỏ hàng</h1>
                    {cart.length == 0 ? (
                        <Alert variant="info">Giỏ hàng trống. Hãy thêm sản phẩm vào giỏ hàng của bạn</Alert>
                    ) : (
                        <Elements stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )} */}
                </Col>
                {cart.length > 0 && (
                    <Col md={5} style={{ minWidth: "100vh" }}>
                        <>
                            <Table responsive="sm" className="cart-table" >
                                <thead>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng thu</th>
                                        <th>Kích cỡ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* loop through cart products */}
                                    {cart.map((item, index) => (
                                        <tr key={index}>
                                            <td>&nbsp;</td>
                                            <td>
                                                {!isLoading && <i className="fa fa-times" style={{ marginRight: 10, cursor: "pointer" }} onClick={() => removeFromCart({ productId: item._id, price: item.price, size: item.size, userId: user._id })}></i>} {/* thêm size */}
                                                <img src={item.pictures[0].url} style={{ width: 100, height: 100, objectFit: "cover" }} />
                                            </td>
                                            <td>{item.price}đ</td>
                                            <td>
                                                <span className="quantity-indicator">

                                                    <i
                                                        className="fa fa-minus-circle"
                                                        onClick={() => {
                                                            if (user.cart[item._id] > 1) {
                                                                handleDecrease({ productId: item._id, price: item.price, size: item.size, userId: user._id });
                                                            } else {
                                                                alert(`Số lượng tối thiểu là 0`);
                                                            }
                                                        }}
                                                    ></i>


                                                    <span>{user.cart[item._id]}</span>

                                                    <i
                                                        className="fa fa-plus-circle"
                                                        onClick={() => {
                                                            // Kiểm tra nếu số lượng chưa đạt tới giới hạn
                                                            if (user.cart[item._id] < parseInt(item.link, 10)) {
                                                                increaseCart({ productId: item._id, price: item.price, size: item.size, userId: user._id });
                                                            } else {
                                                                alert(`Số lượng tối đa là ${parseInt(item.link, 10)}`);
                                                            }
                                                        }}
                                                    >
                                                    </i>

                                                    {/* <i className="fa fa-plus-circle" onClick={() => increaseCart({ productId: item._id, price: item.price, size: item.size, userId: user._id })}></i> */}
                                                </span>
                                            </td>
                                            <td>{item.price * user.cart[item._id]}đ</td>
                                            <td>M </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div>
                                <h3 className="h4 pt-4">Tổng: {Number(user.cart.total).toFixed(0)}đ</h3>
                                {/* <h3 className="h4 pt-4">Total: đ</h3> */}
                                <Button className="mt-3">
                                    <Link to="/pay">Đặt hàng</Link>
                                </Button>
                            </div>
                        </>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default CartPage;