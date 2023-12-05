import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import "./ClientsAdmin.css";
import { useDeleteUserMutation } from "../services/appApi";
import Loading from "./Loading";
function ClientsAdminPage() {
    const [users, setUsers] = useState([]);
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [deleteUser, { isLoading, isSuccess }] = useDeleteUserMutation();

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

    function handleDeleteUser(id) {
    //     // logic here
    //     if (window.confirm("Are you sure?")) deleteUser({ user_id: id });
    // }
    // function handleDeleteUser(id) {
    //     // logic here
    //     if (window.confirm("Are you sure?")) deleteUser({ user_id: id });
    // }
    if (window.confirm("Are you sure?")) {
        deleteUser({ user_id: user._id, id: id })
          .then(() => {
            // Handle success, update local state or perform any necessary actions
            console.log("User deleted successfully");
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
          })
          .catch((error) => {
            // Handle error scenarios, show an error message, etc.
            console.error("Error deleting user", error);
          });
      }
    }



    if (loading) return <Loading />;
    if (users?.length == 0) return <h2 className="py-2 text-center">No users yet</h2>;

    return (
        <>
            <div className="clients-heading" >
                <h1>Tất cả khách hàng</h1>
            </div>
            <Table style={{ marginLeft: "30px", width: "1000px" }} responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>ID Khách hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Email khách hàng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button onClick={() => { handleDeleteUser(user._id); console.log(user._id); }} disabled={isLoading}>
                                    Xóa
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );

    return <div>ClientsAdminPage</div>;
}

export default ClientsAdminPage;