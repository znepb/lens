import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { Picture, Tag, Location } from "../../types";

import ImageDelete from "../../components/modals/ImageDelete";

import { Edit, Trash2 as Trash, PlusCircle as Add } from "react-feather";

import {
  Badge,
  Container,
  Table,
  Spinner,
  Button,
  Modal,
  Alert,
} from "react-bootstrap";

import Navbar from "../../components/admin/Navbar";
import CreateTag from "../../components/modals/CreateTag";

export default function Login() {
  const router = useRouter();

  /* Loded objects (pictures, places, tags) */
  const [tags, setTags] = useState<Tag[]>();

  /* Modal */
  const [index, setIndex] = useState<number>(0);
  const [modal, setModal] = useState("");
  const [modalId, setModalId] = useState(0);

  /* Alert variables */
  const [alertVariant, setAlertVariant] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  var newPlace = "";

  useEffect(() => {
    fetch("/api/tags/all").then((res) =>
      res.json().then((obj) => {
        setTags(obj);
      })
    );
  }, []);

  if (typeof localStorage !== "undefined") {
    if (localStorage.getItem("token")) {
      const handleClose = () => setModal("");

      return (
        <>
          <Navbar loggedIn={true} />

          <Modal show={modal === "delete"} onHide={handleClose}>
            <ImageDelete
              handleClose={handleClose}
              alert={{
                setContent: setAlertContent,
                setVisible: setAlertVisible,
                setVariant: setAlertVariant,
              }}
            />
          </Modal>

          <Modal show={modal === "create"} onHide={handleClose}>
            <CreateTag
              handleClose={handleClose}
              tags={tags}
              alert={{
                setContent: setAlertContent,
                setVisible: setAlertVisible,
                setVariant: setAlertVariant,
              }}
            />
          </Modal>

          <Container
            style={{
              marginTop: "1rem",
              minHeight: "calc(100vh - 90px)",
            }}
          >
            {alertVisible && (
              <Alert variant={alertVariant}>{alertContent}</Alert>
            )}
            <h4>
              Tags <span style={{ marginRight: "0.3rem" }}></span>{" "}
              <Add
                onClick={() => {
                  setModal("create");
                }}
              />
            </h4>
            {tags ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Emote</th>
                      <th>Pictures</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags ? (
                      tags.map((obj, index) => {
                        return (
                          <tr key={obj.id}>
                            <td>{obj.id}</td>
                            <td>{obj.name}</td>
                            <td>
                              {obj.emoji}
                              <span style={{ marginRight: "0.3rem" }}></span>
                            </td>
                            <td>
                              {obj.pictures.length}
                              <span style={{ marginRight: "0.3rem" }}></span>
                            </td>

                            <td>
                              <Trash
                                onClick={() => {
                                  setModalId(index);
                                  setModal("delete");
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <span>Loading</span>
                    )}
                  </tbody>
                </Table>
              </>
            ) : (
              <Spinner animation="border" />
            )}
          </Container>
        </>
      );
    } else {
      router.push("/admin/login");
    }
  } else {
    return <>...</>;
  }
}
