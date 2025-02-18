import React, { useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ToastNotification from "../../constants/ToastNotification";
import { ClockLoader } from "react-spinners";

function CreateNote() {
  const [data, setData] = useState({
    title: "",
    content: "",
    category: ""
  });
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <MainScreen title="Create a Note">
      
      <ToastNotification 
  show={showToast}  
  onClose={() => setShowToast(false)} 
  message="Note created successfully!" 
  variant="success" 
/>
{
  isLoading ? (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh"
    }}>
      <ClockLoader size={50} color={"#123abc"} />
    </div>
  ):

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
    }    </MainScreen>
  );
}

export default CreateNote;