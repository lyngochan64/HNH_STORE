import React from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteProductMutation } from "../services/appApi";
import "./DashboardProducts.css";
import Pagination from "./Pagination";
import "./ClientsAdmin.css";

function DashboardProducts() {
    const products = useSelector((state) => state.products);
    const user = useSelector((state) => state.user);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    // removing the product
    const [deletProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
    
    function handleDeleteProduct(id) {
        // logic here
        if (window.confirm("Are you sure?")) deletProduct({ product_id: id, user_id: user._id });
    }

    function TableRow({ pictures, _id, name, price, link }) {
        return (
            <tr>
                <td>
                    <img src={pictures[0].url} className="dashboard-product-preview" />
                </td>
                <td>{_id}</td>
                <td>{name}</td>
                <td>{Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td>{link}</td>
               
                <td>
                    <Button onClick={() => handleDeleteProduct(_id, user._id)} disabled={isLoading}>
                        Xóa
                    </Button>
                    <Link to={`/product/${_id}/edit`} className="btn btn-warning">
                        Chỉnh sửa
                    </Link>
                </td>
            </tr>
        );
    }

    return (
        <>
        <div className="clients-heading" >
            {/* <h1>Tất cả sản phẩm</h1> */}
            <select onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Tất cả</option>
                    <option value="t-shirt">T-shirt</option>
                    <option value="dress">Dress</option>
                    <option value="shirt">Shirt</option>
                    <option value="jeans">Jeans</option>
                    <option value="jacket">Jacket</option>
                    <option value="skirt">Skirt</option>
                    {/* Thêm các loại sản phẩm khác nếu cần */}
                </select>
        </div>
        <Table style={{ marginLeft: "50px" , width: "1000px"} } striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Hình ảnh</th>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá sản phẩm</th>
                    <th>Có sẵn</th>
                    <th>Thao tác</th>

                </tr>
            </thead>
            <tbody>
            <Pagination
                        data={selectedCategory ? products.filter(product => product.category === selectedCategory) : products}
                        RenderComponent={TableRow}
                        pageLimit={1}
                        dataLimit={products.length}
                        tablePagination={true}
                    />
            </tbody>
        </Table>
        </>
    );
}

export default DashboardProducts;