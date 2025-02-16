import React, { useState } from "react";
import MainScreen from "../../components/MainScreen";
import "./LoginScreen.css";
import { Button, Col, Form, Row, Toast } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginScreen = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // success or danger

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(process.env.REACT_APP_BASE_API_LOCAL);
    try {
      const response = await axios.post(
       `${process.env.REACT_APP_BASE_API_LOCAL}/api/user/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        
        // Show success toast
        setToastMessage("Login Success!");
        setToastVariant("success");
        setShowToast(true);

        // Navigate after a short delay
        setTimeout(() => {
          navigate("/mynotes");
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle error response
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
        
      setToastMessage(errorMessage);
      setToastVariant("danger"); // Set toast background to red for errors
      setShowToast(true);
    }
  };

  return (
    <MainScreen title="LOGIN">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1,
        }}
        bg={toastVariant} // Dynamically set the toast background color
        delay={3000}
        autohide
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">
            {toastVariant === "success" ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>

      <div className="loginContainer">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={user.email}
              onChange={handleInput}
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label style={{ marginTop: "8px" }}>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={user.password}
              onChange={handleInput}
              placeholder="Password"
            />
          </Form.Group>
          <Button style={{ marginTop: "8px" }} variant="primary" type="submit">
            Login
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New User? <Link to="/register">Register Here</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default LoginScreen;
