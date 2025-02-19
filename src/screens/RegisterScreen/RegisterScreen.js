import React, { useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ToastNotification from "../../constants/ToastNotification";
import { ClockLoader } from "react-spinners";
import axios from "axios";

const RegisterScreen = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (message, variant = "success") => {
    setToast({
      show: true,
      message,
      variant,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleConfirmPasswordInput = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any existing error message
    
    if (userData.password !== confirmPassword) {
      showToast("Passwords do not match", "danger");
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_LOCAL}/api/user/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log("register data", response);
      setIsLoading(false);
      showToast("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/mynotes");
      }, 1500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showToast(
        error.response?.data?.msg || "Registration failed",
        "danger"
      );
    }
  };
  return (
    <MainScreen title="REGISTER">
      <ToastNotification
        show={toast.show}
        onClose={hideToast}
        message={toast.message}
        variant={toast.variant}
      />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <ClockLoader size={50} color={"#123abc"} />
        </div>
      ) : (
        <div className="loginContainer">
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="name"
                value={userData.name}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label style={{ marginTop: "8px" }}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                name="email"
                value={userData.email}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label style={{ marginTop: "8px" }}>Password</Form.Label>
              <span style={{ fontSize: "12px", color: "gray", marginLeft: "10px" }}>
                (Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.)
              </span>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={userData.password}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label style={{ marginTop: "8px" }}>
                Confirm Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordInput}
              />
            </Form.Group>

            {/* <Form.Group controlId="pic">
            <Form.Label style={{marginTop:'8px'}}>Profile Picture</Form.Label>
            <Form.Control
            //   onChange={(e) => postDetails(e.target.files[0])}
             
              type="file"
              label="Upload Profile Picture"
              accept="image/*"
              custom='true'
            />
          </Form.Group> */}

            <Button
              style={{ marginTop: "8px" }}
              variant="primary"
              type="submit"
            >
              Register
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              Have an Account ? <Link to="/login">Login</Link>
            </Col>
          </Row>
        </div>
      )}{" "}
    </MainScreen>
  );
};

export default RegisterScreen;
