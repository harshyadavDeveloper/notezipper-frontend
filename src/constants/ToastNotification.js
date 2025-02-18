import React from "react";
import { Toast } from "react-bootstrap";

const ToastNotification = ({ show, onClose, message, variant = "success" }) => {
  // Convert variant to lowercase for consistency with Bootstrap
  const bgVariant = variant.toLowerCase();
  
  return (
    <Toast
      show={show}
      onClose={onClose}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1050, // Ensuring it appears above other elements
      }}
      bg={bgVariant}
      delay={3000}
      autohide
    >
      <Toast.Header closeButton={true}>
        <strong className="me-auto">
          {bgVariant === "success" ? "Success" : bgVariant === "danger" ? "Error" : "Notification"}
        </strong>
      </Toast.Header>
      <Toast.Body className={bgVariant === "light" ? "" : "text-white"}>{message}</Toast.Body>
    </Toast>
  );
};

export default ToastNotification;