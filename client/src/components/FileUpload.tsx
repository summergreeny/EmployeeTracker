import React, { useState, ChangeEvent } from "react";
import { Modal, Button } from "react-bootstrap";

// This component is used to upload a CSV file to the server

export function FileUpload() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log("Selected file:", file);
      setSelectedFile(file);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("http://127.0.0.1:5000/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          alert("File uploaded successfully");
          history.go(0);
        } else {
          alert("Error uploading file");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("No file selected");
    }
    toggleModal();
  };

  return (
    <>
      <Button variant="primary" onClick={toggleModal}>
        Upload CSV File
      </Button>

      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload CSV File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
