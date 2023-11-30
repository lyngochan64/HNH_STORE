import React from "react";
import { Container, Nav, Tab, Col, Row } from "react-bootstrap";
import ClientsAdminPage from "../components/ClientsAdminPage";
import DashboardProducts from "../components/DashboardProducts";
import OrdersAdminPage from "../components/OrdersAdminPage";
import Thongke from "../components/Thongke";
function AdminDashboard() {
    return (
        <Container style={{ minHeight: "60vh"}} >
            <Tab.Container defaultActiveKey="thongke">
                <Row>
                    <Col sm={3} style={{ width: "25vh", padding: "20px"}}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="thongke">THỐNG KÊ</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="products">SẢN PHẨM</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="orders">ĐƠN HÀNG</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="clients">KHÁCH HÀNG</Nav.Link>
                            </Nav.Item>
                            

                        </Nav>
                    </Col>
                    <Col sm={9} style={{  width: "1100px"} }>
                        <Tab.Content>
                            <Tab.Pane eventKey="products">
                                <DashboardProducts />
                            </Tab.Pane>
                            <Tab.Pane eventKey="orders">
                                <OrdersAdminPage />
                            </Tab.Pane>
                            <Tab.Pane eventKey="clients">
                                <ClientsAdminPage />
                            </Tab.Pane>
                            <Tab.Pane eventKey="thongke">
                                <Thongke />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
}

export default AdminDashboard;