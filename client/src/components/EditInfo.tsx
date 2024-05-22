import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

type EditInfoProps = {
  show: boolean;
  handleClose: () => void;
  title: string;
  content: contentInfoProps | null;
};

export type contentInfoProps = {
  name: string;
  id: number;
  employee_count: number;
  description: string;
};

export function EditInfo({ show, handleClose, title, content }: EditInfoProps) {
  const [contentInfo, setContentInfo] = useState({
    id: 0,
    name: "",
    description: "",
  });

  useEffect(() => {
    if (content) {
      setContentInfo({
        id: content?.id || 0,
        name: content?.name || "",
        description: content?.description || "",
      });
    }
  }, [content]);

  const handleCloseModal = () => {
    handleClose();
    setContentInfo({
      id: 0,
      name: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (!contentInfo.name) {
      alert("Name is required.");
      return;
    }

    const requestBody = {
      name: contentInfo.name,
      description: contentInfo.description,
    };

    const endpoint =
      title === "Department"
        ? `http://127.0.0.1:5000/admin/departments/${contentInfo.id}`
        : `http://127.0.0.1:5000/admin/roles/${contentInfo.id}`;

    const request = axios.put(endpoint, requestBody);

    request
      .then((res) => {
        console.log(res.data);
        handleClose();
        window.location.reload(); // Refresh the page after successful save
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert(
          "Error saving employee: " +
            (error.response?.data?.message || error.message)
        );
      });
  };
  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="contentName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={contentInfo.name}
                onChange={(e) =>
                  setContentInfo({
                    ...contentInfo,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="contentDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description"
                value={contentInfo.description}
                onChange={(e) =>
                  setContentInfo({
                    ...contentInfo,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
