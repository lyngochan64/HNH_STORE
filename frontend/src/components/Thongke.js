import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "../axios";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import "./thongke.css";
import Loading from "./Loading";

function Thongke() {
    const [totalOrdersValue, setTotalOrdersValue] = useState(0);
    const [users, setUsers] = useState([]);
    const products = useSelector((state) => state.products);
    const [loading, setLoading] = useState(false);

    const [orders, setOrders] = useState([]);


    useEffect(() => {
        setLoading(true);
        axios
            .get("/orders")
            .then(({ data }) => {
                setLoading(false);
                setOrders(data);
                const totalValue = data.reduce((acc, order) => acc + order.total, 0);
                setTotalOrdersValue(totalValue);
            })
            .catch((e) => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        axios
            .get("/users")
            .then(({ data }) => {
                setLoading(false);
                setUsers(data);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    }, []);

    if (loading) return <Loading />;

return (
    <>
        <section>
            <Container >
                <Row>
                    <Col className="lg-3">
                        <div className="revenue__box">
                            <h5>Total Sales</h5>
                            <span>{totalOrdersValue}</span>
                        </div>
                    </Col>
                    <Col className="lg-3">
                        <div className="order__box">
                            <h5>Total Orders</h5>
                            <span>{orders.length}</span>
                        </div>
                    </Col>
                    <Col className="lg-3">
                        <div className="products__box">
                            <h5>Total Products</h5>
                            <span>{products.length}</span>
                        </div>
                    </Col>
                    <Col className="lg-3">
                        <div className="users__box">
                            <h5>Total Users</h5>
                            <span>{users.length}</span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    </>
)
}
export default Thongke;