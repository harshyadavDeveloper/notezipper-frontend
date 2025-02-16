import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import axios from "axios";

const RegisterScreen = () => {
 const [userData, setUserData] = useState({
  name:"",
  email:"",
  password:"",
 });
 const [confirmPassword, setConfirmPassword] = useState("");
 const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInput = (e)=>{
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  };
  const handleConfirmPasswordInput = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if (userData.password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5000/api/user/register`, userData, {
        headers:{
          'Content-Type': 'application/json'
        }
      });
      console.log('register data', response);
      navigate('/mynotes');

    } catch (error) {
      
    }
  }



 

  return (
    <MainScreen title="REGISTER">
      <div className="loginContainer">
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onClick={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              name='name'
              value={userData.name}
              onChange={handleInput}
             
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label style={{ marginTop: "8px" }}>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              name="email"
              value={userData.email}
              onChange={handleInput}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label style={{ marginTop: "8px" }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Name"
              name="password"
              value={userData.password}
              onChange={handleInput}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label style={{ marginTop: "8px" }}>Confirm Password</Form.Label>
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

          <Button style={{ marginTop: "8px" }} variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Have an Account ? <Link to="/login">Login</Link>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default RegisterScreen;
