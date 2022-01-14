import { Button, Modal, FormControl, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import { Location, Tag } from "../../types";
import { create } from "domain";

export default function ImageCreate({
  handleClose,
  alert,
  locations,
  tags,
}: any) {
  const [forceCoverImage, setForceCoverImage] = useState(false);
  const [setAsCover, setSetAsCover] = useState(false);
  const [locationSelection, setLocationSelection] = useState("");
  const [tagSelection, setTagSelection] = useState<any>([]);
  const [place, setPlace] = useState("");
  const [createTime, setCreateTime] = useState("");
  const [file, setFile] = useState<any>();

  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationFlag, setNewLocationFlag] = useState("");

  const [primaryTagId, setPrimaryTagId] = useState<number | undefined>();

  const [errorMessage, setErrorMessage] = useState("");

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (locationSelection === "other") {
      setForceCoverImage(true);
    } else {
      setForceCoverImage(false);
    }
  }, [locationSelection]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* File & Datetime */}
        <FormControl
          type="file"
          onChange={(e: any) => {
            if (typeof e.target.files != "undefined") {
              setFile(e.target.files);
            }
          }}
        />
        <br />
        <FormControl
          type="datetime-local"
          value={createTime}
          onChange={(e) => {
            setCreateTime(e.target.value);
          }}
        />
        <br />
        {/* Place */}
        <FormControl
          placeholder="Place"
          value={place}
          onChange={(e) => {
            setPlace(e.target.value);
          }}
        />
        <br />
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Description (optional)"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <br />
        <Form.Select
          value={locationSelection}
          onChange={(e) => {
            setLocationSelection(e.target.value);
          }}
        >
          <option>Select Location</option>
          {locations.map((location: Location, idx: number) => (
            <option value={location.id} key={idx}>
              {location.flag} {location.name}
            </option>
          ))}
          <option value="other">Other...</option>
        </Form.Select>
        {/* New Location */}
        {forceCoverImage && (
          <div>
            <br />
            <h5>New Location</h5>
            <FormControl
              placeholder="Location Name"
              value={newLocationName}
              onChange={(e) => {
                setNewLocationName(e.target.value);
              }}
            />
            <br />
            <FormControl
              placeholder="Flag"
              value={newLocationFlag}
              onChange={(e) => {
                setNewLocationFlag(e.target.value);
              }}
            />
          </div>
        )}
        <br />
        {/* Tag Select */}
        <Form.Select
          onChange={(e) => {
            setTagSelection(
              Array.from(e.target.selectedOptions).map((e) => Number(e.value))
            );
          }}
          multiple
        >
          {tags.map((tag: Tag, idx: number) => (
            <option value={tag.id} key={idx}>
              {tag.emoji} {tag.name}
            </option>
          ))}
        </Form.Select>
        <br />
        <Form.Select
          onChange={(e) => {
            console.log(e);
            setPrimaryTagId(Number(e.target.value));
          }}
          defaultValue=""
        >
          <option value="">Select Primary Tag...</option>
          {tags.map((tag: Tag, idx: number) => (
            <option value={tag.id} key={idx}>
              {tag.emoji} {tag.name}
            </option>
          ))}
        </Form.Select>
        <br />
        {/* Set as cover image */}
        <Form.Check
          type="checkbox"
          onChange={(e) => {
            setSetAsCover(e.target.checked);
          }}
          disabled={forceCoverImage}
          checked={forceCoverImage == true ? true : setAsCover}
          label="Set as cover image for location"
        />

        <span style={{ color: "red" }}>{errorMessage}</span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            if (
              locationSelection != "" &&
              tagSelection != "" &&
              createTime != "" &&
              file != undefined &&
              primaryTagId != undefined
            ) {
              const beforePromises = [];

              const form = new FormData();
              form.append("photo", file[0]);

              beforePromises.push(
                fetch("/api/images/upload", {
                  method: "POST",
                  body: form,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
              );

              if (locationSelection == "other") {
                if (newLocationName && newLocationFlag) {
                  beforePromises.push(
                    fetch("/api/locations/create", {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: newLocationName,
                        flag: newLocationFlag,
                        cover: "",
                      }),
                      method: "POST",
                    })
                  );
                } else {
                  setErrorMessage("All feilds are required.");
                  return;
                }
              }

              Promise.all(beforePromises).then(async (results) => {
                handleClose();

                let imageId = (await results[0].json()).name;
                let locationId = Number(locationSelection);

                if (locationSelection == "other") {
                  locationId = (await results[1].json()).id;
                }

                fetch("/api/images/create", {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    filepath: imageId,
                    place: place,
                    createdAt: createTime,
                    locationId: locationId,
                    tags: tagSelection,
                    description: description,
                    setAsCover: String(forceCoverImage || setAsCover),
                    primaryTagID: primaryTagId,
                  }),
                  method: "POST",
                }).then(() => {
                  alert.setVariant("success");
                  alert.setContent("Image uploaded successfully!");
                  alert.setVisible(true);
                });
              });
            } else {
              setErrorMessage("All feilds are required.");
            }
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </>
  );
}
