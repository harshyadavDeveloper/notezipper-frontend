import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Nav, NavDropdown, Navbar, Toast } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const name = localStorage.getItem('name');
  const [showToast, setShowToast] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setShowToast(true);
    navigate('/login');
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate('/myprofile');
  }

  // Hide header if on login page
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1
        }}
        bg="danger"
        delay={3000}
        autohide
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-white">Logged out!</Toast.Body>
      </Toast>

      <Container>
        <Navbar.Brand>
          <Link to="/">Note Zipper</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="m-auto">
            <Form className="d-flex">
              {/* <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              /> */}
            </Form>
          </Nav>
          <Nav className="me-auto">
            <Link to="/mynotes">My Notes</Link>
            <NavDropdown title={name} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleProfileClick}>My Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>
                Log out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
