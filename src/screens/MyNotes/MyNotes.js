import React, { useEffect, useState, useCallback } from "react";
import MainScreen from "../../components/MainScreen";
import { Accordion, Badge, Button, Card, Modal, Toast, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);


  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  // Fetch notes from API

  const getNotes = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_API_LOCAL}/api/notes`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setNotes(Array.isArray(response.data.notes) ? response.data.notes : []);
    } catch (error) {
      console.log(error.message);
    }
  }, [token]); // Only changes when token changes
  
  useEffect(() => {
    getNotes();
  }, [getNotes]); // Runs only when getNotes changes
  // Add token as a dependency since it's used in getNotes

  // Show delete confirmation modal
  const handleShowModal = (noteId) => {
    setNoteToDelete(noteId);
    setShowModal(true);
  };

  // Hide delete confirmation modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNoteToDelete(null);
  };

  // Handle note deletion
  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BASE_API_LOCAL}/api/notes/delete/${noteToDelete}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setShowModal(false);
      setNoteToDelete(null);
      setShowToast(true);
      getNotes(); // Refresh notes list
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };

  // Show edit modal with note details
  const handleShowEditModal = (note) => {
    setNoteToEdit(note._id);
    setEditedTitle(note.title);
    setEditedCategory(note.category);
    setEditedContent(note.content);
    setShowEditModal(true);
  };

  // Handle note update
  const handleUpdateNote = async () => {
    if (!noteToEdit || !editedTitle || !editedContent) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_API_LOCAL}/api/notes/update/${noteToEdit}`,
        {
          title: editedTitle,
          category: editedCategory,
          content: editedContent,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setShowEditModal(false);
      setShowUpdateToast(true); 
      setNoteToEdit(null);
      getNotes(); // Refresh notes list
    } catch (error) {
      console.error("Error updating note:", error.message);
    }
  };

  return (
    <MainScreen title={`Welcome Back ${name} `}>
      <Link to="/createnotes">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)}
          style={{ position: 'fixed', top: 20, right: 20, zIndex: 1 }}
          bg="success"
          delay={3000}
          autohide
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Note Deleted!</Toast.Body>
        </Toast>

        <Toast 
  show={showUpdateToast} 
  onClose={() => setShowUpdateToast(false)}
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
  <Toast.Body className="text-white">Note Updated Successfully!</Toast.Body>
</Toast>


        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Create New Note
        </Button>
      </Link>

      {notes.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          No Notes Found. Create your first note!
        </div>
      ) : (
        <Accordion defaultActiveKey="0">
          {notes.map((note, index) => (
            <Card key={note._id} style={{ margin: 10 }}>
              <Accordion.Item eventKey={index.toString()}>
                <Card.Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Accordion.Button>{note.title}</Accordion.Button>
                  
                  <div style={{ display: "flex", marginLeft: "8px", gap: "8px" }}>
                    <Button 
                      variant="info" 
                      onClick={() => handleShowEditModal(note)} // Show edit modal
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      className="mx-2"
                      onClick={() => handleShowModal(note._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Header>

                <Accordion.Body>
                  <Card.Body>
                    <h4>
                      <Badge bg="success">{note.category || "Uncategorized"}</Badge>
                    </h4>
                    <blockquote className="blockquote mb-0">
                      <p>{note.content}</p>
                      <footer className="blockquote-footer">
                        Created on <cite title="Source Title">{new Date(note.createdAt).toLocaleDateString()}</cite>
                      </footer>
                    </blockquote>
                  </Card.Body>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this note?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteNote}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Note Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)} 
              />
            </Form.Group>

            <Form.Group controlId="category" className="mt-2">
              <Form.Label>Category</Form.Label>
              <Form.Control 
                type="text" 
                value={editedCategory} 
                onChange={(e) => setEditedCategory(e.target.value)} 
              />
            </Form.Group>

            <Form.Group controlId="content" className="mt-2">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={editedContent} 
                onChange={(e) => setEditedContent(e.target.value)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateNote}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </MainScreen>
  );
};

export default MyNotes;
