import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "./Loading";
import Pagination from "./Pagination";
import html2canvas from "html2canvas";
import "./ClientsAdmin.css";


function OrdersAdminPage() {
    const [totalOrdersValue, setTotalOrdersValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const products = useSelector((state) => state.products);
    const [orderToShow, setOrderToShow] = useState([]);
    const [show, setShow] = useState(false);
    const ep = useRef(null)

    const handleClose = () => setShow(false);



    const exportAsImage = async (element, imageFileName) => {
        const canvas = await html2canvas(element);
        const image = canvas.toDataURL("image/png", 1.0);
        // download the image
        downloadImage(image, imageFileName);
    };


    const downloadImage = (blob, fileName) => {
        const fakeLink = window.document.createElement("a");
        fakeLink.style = "display:none;";
        fakeLink.download = fileName;

        fakeLink.href = blob;

        document.body.appendChild(fakeLink);
        fakeLink.click();
        document.body.removeChild(fakeLink);

        fakeLink.remove();
    };

    function markShipped(orderId, ownerId) {
        axios
            .patch(`/orders/${orderId}/mark-shipped`, { ownerId })
            .then(({ data }) => setOrders(data))
            .catch((e) => console.log(e));
    }

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

    if (loading) {
        return <Loading />;
    }

    if (orders.length === 0) {
        return <h1 className="text-center pt-4">Chưa có đơn đặt hàng</h1>;
    }

    function TableRow({ _id, count, owner, total, status, products, address, country }) {
        return (
            <tr>
                <td>{_id}</td>
                <td>{owner?.name}</td>
                <td>{count}</td>
                <td>{total}</td>
                {/* <td>{address}</td>
                <td>{country}</td> */}

                <td>
                    {status === "processing" ? (
                        <Button size="sm" onClick={() => markShipped(_id, owner?._id)}>
                            Đánh dấu đã giao
                        </Button>
                    ) : (
                        <Badge bg="success">Đã giao</Badge>
                    )}
                </td>
                <td>
                    <span style={{ cursor: "pointer" }} onClick={() => showOrder({ userName: owner?.name, address, country, products })}>
                        Xem đơn hàng <i className="fa fa-eye"></i>
                    </span>
                </td>
            </tr>
        );
    }



    return (
        <>
            <div className="clients-heading">
                <h1>Tất cả đơn hàng</h1>
            </div>
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Mặt hàng</th>
                        <th>Tổng đơn hàng</th>
                        {/* <th>Địa chỉ</th>
                        <th>Liên hệ</th> */}
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <Pagination data={orders} RenderComponent={TableRow} pageLimit={1} dataLimit={10} tablePagination={true} />
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
                    <p className="order-details__container d-flex justify-content-around py-2">Địa chỉ: {orderToShow?.order?.address}</p>
                    <p className="order-details__container d-flex justify-content-around py-2">Liên hệ: {orderToShow?.order?.country}</p>
                    <p className="order-details__container d-flex justify-content-around py-2">Tên khách hàng: {orderToShow?.order?.userName}</p>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>

                    {/* <Button onClick={() => exportAsPdf(ep.current, 'test')}>
                        Xuất PDF
                    </Button> */}
                    <Button onClick={() => exportAsImage(ep.current, "test")}>
                        Xuất
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrdersAdminPage;