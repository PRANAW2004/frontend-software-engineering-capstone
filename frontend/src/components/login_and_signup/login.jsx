import { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import SERVER_URL from "../../server_config";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import { mutate } from "swr";
import { useReducer } from "react";

const initialFormState = {
    email: "",
    password: "",
};

function formReducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "RESET":
            return initialFormState;
        default:
            return state;
    }
}


export default function Login() {

    const navigate = useNavigate();

    const [formState, dispatch] = useReducer(formReducer, initialFormState);
    const { email, password } = formState;
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

    async function handleClick(e) {
        e.preventDefault();

        if (!email || !password) {
            setToastMessage("Email and password cannot be empty");
            setShowToast(true);
            return;
        }

        try {
            const response1 = await fetch(`${SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"

            });

            const response = await response1.json();
            console.log(response.status);

            if (response.error) {
                setToastMessage(response.error);
                setShowToast(true);
            } else {
                console.log(response.message === undefined);
                const userId = response.userId;
                if (response.message !== undefined) {
                    // mutate(`${SERVER_URL}/login-state`);
                    await mutate(`${SERVER_URL}/login-state`, undefined, { revalidate: true });
                    localStorage.setItem("userId", userId);
                    navigate("/homepage", { replace: true });
                    setToastMessage("Login Successful, redirecting to Home Page");
                    setShowToast(true);
                } else {
                    console.log("some unknown error occured");
                    setToastMessage(response.error);
                    setShowToast(true);
                }
            }

        } catch (err) {
            console.log(err);
            setToastMessage("Some unknown error occures, please try again");
            setShowToast(true);
        }


    }

    return <div style={{ background: "linear-gradient(to bottom right, white 0%, white 50%, #0d6efd 50%, #0d6efd 100%)" }}>
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "25rem" }} className="shadow-lg p-4 rounded-4 bg-white border-0">
                <h1 className="text-center mb-2 fw-bold">Welcome Back</h1>
                <p className="text-center text-muted mb-4">Please login to continue</p>


                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control name="email" type="email" value={email}
                            //  onChange={(e) => setEmail(e.target.value)} 
                            onChange={(e) =>
                                dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
                            }
                            placeholder="Enter email" className="email"
                        />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" value={password}
                            onChange={(e) =>
                                dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })
                            }

                            placeholder="Password" className="password" />
                    </Form.Group>


                    <Button variant="primary" onClick={handleClick} type="submit" className="w-100 py-2 rounded-3 fw-semibold">
                        Login
                    </Button>
                    <p className="text-center mt-3 text-muted">
                        Don't have an account? <a href="/signup" className="fw-semibold text-primary">Sign up</a>
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
                                    credentials: "include"
                                })
                                    .then(async (res) => { const res1 = await res.json(); console.log(res1.localId); localStorage.setItem("userId", res1.localId) })
                                    .then(async (res) => { await mutate(`${SERVER_URL}/login-state`, undefined, { revalidate: true }); navigate("/homepage", { replace: true }) })

                                    .catch((err) => { console.log(err.status); setToastMessage("Some Unknown error occured, please try again"); setShowToast(true) });

                            }}
                            onError={() => console.log("Google Login Failed")}
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