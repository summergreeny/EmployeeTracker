import { Modal, Button } from "react-bootstrap";
// When user is about to delete an employee, this modal will pop up to confirm the deletion
type DeleteWarningModalProps = {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export function DeleteWarningModal({
  show,
  onClose,
  onDelete,
}: DeleteWarningModalProps) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteWarningModal;
