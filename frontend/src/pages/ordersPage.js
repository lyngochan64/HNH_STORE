import React, { useEffect, useRef, useState } from "react";
import { Badge, Container, Button, Table, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "../components/Loading";
import "./ordersPage.css";

function OrdersPage() {
    const user = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const products = useSelector((state) => state.products);
    const [show, setShow] = useState(false);
    const [orderToShow, setOrderToShow] = useState([]);
    const handleClose = () => setShow(false);
    const ep = useRef(null)

    function showOrder(order) {
        const productsObj = order.products
        console.log("kjksfjsk", order);
        let productsToShow = products.filter((product) => productsObj[product._id]);
        productsToShow = productsToShow.map((product) => {
            const productCopy = { ...product };
            productCopy.count = productsObj[product._id];
            delete productCopy.description;
            return productCopy;
        });
        console.log({ productsToShow });
        setShow(true);
        setOrderToShow({ order: order, products: productsToShow });
    }

    useEffect(() => {
        setLoading(true);
        axios
            .get(`/users/${user._id}/orders`)
            .then(({ data }) => {
                setLoading(false);
                console.log("orders", { orders });
                setOrders(data);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (orders.length === 0) {
        return <h1 className="text-center pt-3">Chưa có đơn hàng</h1>;
    }

    return (
<>
        <div className="pt-3 category-banner-container">

                <h1 className="text-center">Đơn hàng của tôi</h1>
            </div>

        <Container style={{  minHeight: "30vh", paddingTop: "20px"}} >

            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Trạng thái</th>
                        <th>Ngày</th>
                        <th>Tổng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody> 
                    {orders.map((order) => (
                        <tr>
                            <td>{order._id}</td>
                            <td>
                                <Badge bg={`${order.status == "processing" ? "warning" : "success"}`} text="white">
                                    {order.status}
                                </Badge>
                            </td>
                            <td>{order.date}</td>

                            <td>{order.total} đ</td>
                            <td>
                                <span style={{ cursor: "pointer" }} onClick={() => showOrder(order)}>
                                    Xem chi tiết <i className="fa fa-eye"></i>
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <div ref={ep}>
                    {orderToShow?.products?.map((order) => (
                        <div className="order-details__container d-flex justify-content-around py-2">
                            <img src={order.pictures[0].url} style={{ maxWidth: 100, height: 100, objectFit: "cover" }} />
                            <p style={{ marginTop: '4vh' }}>
                                <span>{order.count} x </span> {order.name}
                            </p>
                            <p style={{ marginTop: '4vh' }}>Giá: {Number(order.price) * order.count} đ</p>
                            <p style={{ marginTop: '4vh' }}>Size: M</p>
                        </div>
                    ))}
                    
                    <p className="order-details__container d-flex justify-content-around py-2">Liên hệ: {orderToShow?.order?.country}</p>
                    <p className="order-details__container d-flex justify-content-around py-2">Địa chỉ: {orderToShow?.order?.address}</p>
                </div>
                <Modal.Footer>


                </Modal.Footer>
            </Modal>
        </Container>
        </>
    );
}

export default OrdersPage;