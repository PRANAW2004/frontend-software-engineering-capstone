import { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import SERVER_URL from "../../server_config";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";

export default function SignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();

    async function handleClick(e) {
        e.preventDefault();

        console.log(email, password);

        if (!email || !password) {
            setToastMessage("Email and Password cannot be empty!");
            setShowToast(true);
            return;
        }
        try {
            const response1 = await fetch(`${SERVER_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),

            });
            const response = await response1.json();
            console.log(response);
            if (response.error) {
                setToastMessage(response.error);
                setShowToast(true);
            } else {
                setToastMessage("Sign Up Successful :)");
                setToastMessage("Redirecting to Login Pafe");
                setShowToast(true);
            }
        } catch (err) {
            setToastMessage("Something went wrong!");
            setShowToast(true);
        }



    }

    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

    return <div style={{ background: "linear-gradient(to bottom right, white 0%, white 50%, #0d6efd 50%, #0d6efd 100%)" }}>
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "25rem" }} className="shadow-lg p-4 rounded-4 bg-white border-0">
                <h1 className="text-center mb-2 fw-bold">Create Account</h1>
                <p className="text-center text-muted mb-4">Sign Up</p>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" className="email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="password" />
                    </Form.Group>

                    <Button onClick={handleClick} variant="primary" type="submit" className="w-100 py-2 rounded-3 fw-semibold">
                        Sign Up
                    </Button>
                    <p className="text-center mt-3 text-muted">
                        Go back to <a href="/login" className="fw-semibold text-primary">Login</a>
                    </p>
                    <GoogleOAuthProvider clientId={CLIENT_ID}>
                        <GoogleLogin
                            onSuccess={(response) => {
                                const credential = response.credential;
                                console.log("Google Token:", credential);

                                fetch(`${SERVER_URL}/google-signin`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ credential }),
                                })
                                    .then((res) => res.json(), navigate("/homepage", { replace: true }))
                                    .then((data) => console.log("Backend:", data))
                                    .catch((err) => setToastMessage("Some Unknown error occured, please try again"), setShowToast(true));
                            }}
                            onError={() => {setToastMessage("Google Login Failed");setShowToast(true);}}
                        />
                    </GoogleOAuthProvider>
                </Form>

            </Card>

        </Container>
        <ToastContainer position="top-end" className="p-3">
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                bg="danger"
            >
                <Toast.Body className="text-white">{toastMessage}</Toast.Body>
            </Toast>
        </ToastContainer>
    </div>
}