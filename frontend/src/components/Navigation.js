import axios from "../axios";
import React, { useRef, useState } from "react";
import { Navbar, Button, Nav, NavDropdown, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout, resetNotifications } from "../features/userSlice";
import "./Navigation.css";
import moment from "moment";

function Navigation() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const bellRef = useRef(null);
    const notificationRef = useRef(null);
    const [bellPos, setBellPos] = useState({});

    function handleLogout() {
        dispatch(logout());
    }
    const unreadNotifications  = user?.notifications?.reduce((acc, current) => {
        if (current.status == "unread") return acc + 1 ;
        return acc;
    }, 0);

    function handleToggleNotifications() {
        const position = bellRef.current.getBoundingClientRect();
        setBellPos(position);
        notificationRef.current.style.display = notificationRef.current.style.display === "block" ? "none" : "block";
        dispatch(resetNotifications());
        if (unreadNotifications > 0) axios.post(`/users/${user._id}/updateNotifications`);
    }

    const noti = unreadNotifications - 1 ;
 

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand><img style={{ maxHeight: "50px" }} src="https://i.imgur.com/EjlVDU7.png" /></Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <div style={{ marginRight: "400px"}} className="menu nav__item">
                            
                            <LinkContainer to="/">
                                <Nav.Link>Trang chủ</Nav.Link>
                            </LinkContainer>

                           
                            <LinkContainer to="/category/all">
                                <Nav.Link>Mua sắm</Nav.Link>
                            </LinkContainer>
                        </div>

                        {/* if no user */}
                        {!user && (
                                <LinkContainer to="/login">
                                    <Nav.Link>Đăng nhập</Nav.Link>
                                </LinkContainer>
                        )}


                        {user && !user.isAdmin && (
                            
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <i className="fas fa-shopping-cart"></i>
                                    {user?.cart.count > 0 && (
                                        <span className="badge badge-warning" id="cartcount">
                                            {user.cart.count}
                                        </span>
                                    )}
                                </Nav.Link>
                            </LinkContainer>
                        )}

                        {/* if user */}
                        {user && (
                            <>
                                <Nav.Link style={{ position: "relative" }} onClick={handleToggleNotifications}>
                                    <i className="fas fa-bell" ref={bellRef} data-count={noti > 0 ? noti : null}></i>
                                </Nav.Link>
                                <NavDropdown title={`${user.name}`} id="basic-nav-dropdown">
                                    {user.isAdmin && (
                                        <>
                                            <LinkContainer to="/admin">
                                                <NavDropdown.Item>Tổng quan</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/new-product">
                                                <NavDropdown.Item>Tạo sản phẩm</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}
                                    {!user.isAdmin && (
                                        <>
                                            <LinkContainer to="/cart">
                                                <NavDropdown.Item>Giỏ hàng</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/orders">
                                                <NavDropdown.Item>Đơn hàng</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}

                                    <NavDropdown.Divider />
                                    <Button variant="danger" onClick={handleLogout} className="logout-btn">
                                        Đăng xuất
                                    </Button>
                                </NavDropdown>
                            </>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
            {/* notifications */}
            <div className="notifications-container" ref={notificationRef} style={{ position: "absolute", top: bellPos.top + 30, left: bellPos.left, display: "none" }}>
                {user?.notifications.length > 0 ? (
                    user?.notifications.map((notification) => (
                        <p className={`notification-${notification.status}`}>
                            {notification.message}
                            <br />
                            <span>{new moment(notification.time).format('MMMM Do YYYY, h:mm:ss')}</span>
                        </p>
                    ))
                ) : (
                    <p>Chưa có thông báo</p>
                )}
            </div>
        </Navbar>
    );
}

export default Navigation;