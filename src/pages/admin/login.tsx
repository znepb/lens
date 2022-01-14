import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

import { useRouter } from "next/router";

import { Button, FormControl, Container } from "react-bootstrap";

import Navbar from "../../components/admin/Navbar";

export default function Login() {
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  async function login() {
    let resp = await (
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
        }),
      })
    ).json();

    if (resp.error) {
      setMessage(resp.error.message);
    } else if (resp.token) {
      localStorage.setItem("token", resp.token);
      router.push("/admin/images");
    }
  }

  return (
    <>
      <Navbar loggedIn={false} />
      <Container
        style={{
          width: "20rem",
          marginTop: "1rem",
          padding: "1rem",
          minHeight: "calc(100vh - 90px)",
        }}
      >
        <h4
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          Log In
        </h4>

        <br />

        <FormControl
          placeholder="Password"
          aria-label="Password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          aria-describedby="basic-addon1"
        />

        <p style={{ color: "red" }}>{message}</p>

        <Button onClick={login}>Login</Button>
      </Container>
    </>
  );
}
