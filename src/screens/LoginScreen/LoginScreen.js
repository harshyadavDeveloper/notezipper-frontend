import React, { useState } from "react";
import MainScreen from "../../components/MainScreen";
import "./LoginScreen.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ToastNotification from "../../constants/ToastNotification";
import { ClockLoader } from "react-spinners";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginScreen = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // success or danger
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
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
      
          navigate("/mynotes");
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle error response
      const errorMessage =
      error.response?.data?.message || "Something went wrong!";
      
      setToastMessage(errorMessage);
      setToastVariant("danger"); // Set toast background to red for errors
      setIsLoading(false); // Reset loading state when error occurs
      setShowToast(true);
    }
  };

  return (
    <MainScreen title="LOGIN">
      {isLoading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh"
        }}>
          <ClockLoader size={50} color={"#123abc"} />
        </div>
      ) : (
        <>
          {showToast && (
            <ToastNotification 
              show={showToast}  
              onClose={() => setShowToast(false)} 
              message={toastMessage} 
              variant={toastVariant}
            />
          )}
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
        </>
      )}
    </MainScreen>
  );
};

export default LoginScreen;