import React, { useEffect } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('name');

  useEffect(() => {

    // if (name && email) {
    //   setUser({ name, email });
    // } else {
    //   navigate('/login'); // Redirect if no user data
    // }
  }, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <Card style={{ width: '400px', padding: '20px', borderRadius: '10px' }}>
        <h3 className="text-center mb-4">My Profile</h3>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={username} readOnly />
          </Form.Group>

         
          <Button variant="primary" className="w-100 mt-4" onClick={() => navigate('/mynotes')}>
            Back to My Notes
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Profile;
