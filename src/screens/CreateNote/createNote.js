import React, { useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Card, Form, Toast } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateNote() {
  const [data, setData] = useState({
    title: "",
    content: "",
    category: ""
  });
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const {name, value} = e.target;
    setData({
      ...data, 
      [name]: value
    });
  };

  const resetHandler = () =>{
    setData({
      title: "",
      content: "",
      category: ""
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (data.title && data.content && data.category) {
        const response = await axios.post(
          // "http://localhost:5000/api/notes/create", 
          `${process.env.REACT_APP_BASE_API_LOCAL}/api/notes/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log(response);
        resetHandler();
        
        // Show success toast
        setShowToast(true);
        navigate('/mynotes');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainScreen title="Create a Note">
       <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1
        }}
        bg="success"
        delay={3000}
        autohide
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-white">Note created successfully!</Toast.Body>
      </Toast>
      <Card>
        <Card.Header>Create a new Note</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={data.title}
                placeholder="Enter the title"
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={data.content}
                placeholder="Enter the content"
                rows={4}
                onChange={handleInput}
              />
            </Form.Group>
            {data.content && (
              <Card>
                <Card.Header>Note Preview</Card.Header>
                <Card.Body>
                  <ReactMarkdown>{data.content}</ReactMarkdown>
                </Card.Body>
              </Card>
            )}

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={data.category}
                placeholder="Enter the Category"
                onChange={handleInput}
              />
            </Form.Group>
            <Button style={{ marginTop: "8px" }} type="submit" variant="primary">
              Create Note
            </Button>
            <Button 
              style={{ marginTop: "8px" }} 
              className="mx-2" 
              onClick={resetHandler} 
              variant="danger"
              type="button"
            >
              Reset Fields
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          Creating on - {new Date().toLocaleDateString()}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default CreateNote;