import { useState } from "react";
import { Button, Modal, FormControl, Form } from "react-bootstrap";

export default function CreateTag({ handleClose, alert }: any) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState<any>();
  const [bgColor, setBgColor] = useState<any>();

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create tag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* File & Datetime */}
        <FormControl
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <br />
        <FormControl
          placeholder="Emoji"
          onChange={(e) => {
            setEmoji(e.target.value);
          }}
        />
        <br />
        <h6>Category Text Color</h6>
        <FormControl
          type="color"
          onChange={(e) => {
            setColor(e.target.value);
          }}
        />
        <br />
        <h6>Category Background Color</h6>
        <FormControl
          type="color"
          onChange={(e) => {
            setBgColor(e.target.value);
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            fetch("http://localhost:3000/api/tags/create", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: name,
                textColor: color,
                backgroundColor: bgColor,
                emoji: emoji,
              }),
              method: "POST",
            }).then(() => {
              alert.setVariant("success");
              alert.setContent("Success!");
              alert.setVisible(true);
            });

            handleClose();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </>
  );
}
