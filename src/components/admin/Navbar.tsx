import "bootstrap/dist/css/bootstrap.min.css";

import Head from "next/head";

import { Navbar, Container, Nav } from "react-bootstrap";

interface Props {
  loggedIn?: boolean;
}

export default function AdminNavbar({ loggedIn }: Props) {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/znepb-photos.svg"
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{" "}
            Lens
          </Navbar.Brand>
          {loggedIn && (
            <Nav className="me-auto">
              <Nav.Link href="/admin/images">Images</Nav.Link>
              <Nav.Link href="/admin/tags">Tags</Nav.Link>
              <Nav.Link href="/admin/locations">Locations</Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
}
