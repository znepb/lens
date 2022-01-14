import { Button, Modal } from "react-bootstrap";

export default function ImageDelete({ handleClose, alert }: any) {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Delete Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this photo? This action cannot be
        reversed!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            handleClose();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </>
  );
}
