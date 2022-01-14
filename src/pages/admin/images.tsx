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
import ImageCreate from "../../components/modals/ImageCreate";

export default function Login() {
  const router = useRouter();

  /* Loded objects (pictures, places, tags) */
  const [objects, setObjects] = useState<Picture[]>();
  const [locations, setLocations] = useState<Location[]>();
  const [tags, setTags] = useState<Tag[]>();

  /* For when you reach the end */
  const [reachedEnd, setReachedEnd] = useState(false);

  /* Modal */
  const [index, setIndex] = useState<number>(0);
  const [modal, setModal] = useState("");
  const [modalId, setModalId] = useState(0);

  /* Alert variables */
  const [alertVariant, setAlertVariant] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  var newPlace = "";

  async function fetchMore(index: number) {
    const results: Picture[] = await (
      await fetch(`/api/images/all?skip=${index}&adminSort=true`)
    ).json();

    return [results];
  }

  useEffect(() => {
    const picturesLoad = fetchMore(0);
    const tagsPromise = fetch("/api/tags/all");
    const locationsPromise = fetch("/api/locations/all");

    Promise.all([picturesLoad, tagsPromise, locationsPromise]).then(
      async (values) => {
        /* Images */
        const images = values[0][0];

        if (images.length < 25) {
          setReachedEnd(true);
        } else {
          setIndex(index + images.length);
        }

        setObjects(images);

        setTags(await values[1].json());
        setLocations(await values[2].json());
      }
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
            <ImageCreate
              handleClose={handleClose}
              alert={{
                setContent: setAlertContent,
                setVisible: setAlertVisible,
                setVariant: setAlertVariant,
              }}
              locations={locations}
              tags={tags}
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
              Images <span style={{ marginRight: "0.3rem" }}></span>{" "}
              <Add
                onClick={() => {
                  setModal("create");
                }}
              />
            </h4>
            {objects ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>File Name</th>
                      <th>Place</th>
                      <th>Taken</th>
                      <th>Location</th>
                      <th>Tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations && tags && objects ? (
                      objects.map((obj, index) => {
                        const thisLoc = locations.filter(
                          (o) => o.id == obj.location
                        )[0];

                        const theseTags: Tag[] = [];

                        obj.tags.forEach((lookingFor) => {
                          theseTags.push(
                            ...tags.filter((b) => b.id == lookingFor)
                          );
                        });

                        return (
                          <tr key={obj.filepath}>
                            <td>{obj.id}</td>
                            <td>
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={`/photos/${obj.filepath}`}
                              >
                                {obj.filepath}
                              </a>
                            </td>
                            <td>
                              {obj.place}
                              <span style={{ marginRight: "0.3rem" }}></span>
                            </td>
                            <td>
                              {obj.taken}
                              <span style={{ marginRight: "0.3rem" }}></span>
                            </td>
                            <td>
                              <Badge bg="secondary">
                                {thisLoc
                                  ? `${thisLoc.flag} ${thisLoc.name}`
                                  : "Failed to find location"}
                              </Badge>
                              <span style={{ marginRight: "0.3rem" }}></span>
                            </td>
                            <td>
                              {theseTags.map((obj) => (
                                <>
                                  <Badge bg="secondary">
                                    {obj.emoji} {obj.name}
                                  </Badge>
                                  <span
                                    style={{ marginRight: "0.3rem" }}
                                  ></span>
                                </>
                              ))}

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

                {!reachedEnd && (
                  <Button
                    onClick={() => {
                      fetchMore(index).then((value) => {
                        const [images] = value;

                        if (images.length < 25) {
                          setReachedEnd(true);
                        } else {
                          setIndex(index + images.length);
                        }

                        setObjects([...objects, ...images]);
                      });
                    }}
                  >
                    Load More
                  </Button>
                )}
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
