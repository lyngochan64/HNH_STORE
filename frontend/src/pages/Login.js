import React, {useState} from 'react';
import { Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../services/appApi';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, {isError, isLoading, error}] = useLoginMutation();

    function handleLogin(e) {
        e.preventDefault();
        login({email, password});
    }
    return (
    <Container>
        <Row>
            <Col md={6} className="login__form--container">
                <Form style={{width: "100%"}} onSubmit={handleLogin}>
                    <h1>Đăng nhập vào tài khoản của bạn</h1>
                    {isError && <Alert variant="danger">{error.data}</Alert>}
                    <Form.Group>
                        <Form.Label>Emaill</Form.Label>
                        <Form.Control type="email" placeholder="Email" value={email} required onChange={(e)=> setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" placeholder="Mật khẩu" value={password} required onChange={(e)=> setPassword(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                        <Button type="submit" disabled={isLoading}>Đăng nhập</Button>
                    </Form.Group>

                    <p className="pt-3 text-center">Bạn chưa có tài khoản? <Link to="/signup">Đăng kí</Link>{" "}</p>
                </Form>
            </Col>
            <Col md={6} className="login__image--container"></Col>
        </Row>
    </Container>
  )
}

export default Login