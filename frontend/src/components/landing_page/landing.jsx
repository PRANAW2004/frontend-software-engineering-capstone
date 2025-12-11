import useSWR from 'swr';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../../server_config';
import { Navbar, Container, Row, Col } from "react-bootstrap";

export default function LandingPage() {

    const fetcher = (url) =>
        fetch(url, { credentials: "include" }).then((res) => {
            if (!res.ok) throw new Error("Not logged in");
            return res.json();
        });

    const navigate = useNavigate();

    const { data, error, isLoading } = useSWR(
        `${SERVER_URL}/login-state`,
        fetcher
    );
    console.log(error);
    useEffect(() => {
        if (!isLoading) {
            if (data?.loggedIn) {
                navigate("/homepage", { replace: true });
            }
        }
    }, [data, isLoading, navigate]);

    if (isLoading) return <p>Loading...</p>;

    if (!data?.loggedIn) {
        return             <div>

                {/* Top Navbar */}
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand>Recipe Management System</Navbar.Brand>
                    </Container>
                </Navbar>

                {/* Main section */}
                <Container 
                    fluid 
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "90vh" }}
                >
                    <Row className="w-75 align-items-center">
                        <Col md={6} className="text-center mb-4 mb-md-0">
                            <img
                                src="./images/tablet-kitchen.jpg"
                                alt="tablet-kitchen"
                                className="img-fluid rounded shadow"
                            />
                        </Col>
                        <Col md={6}>
                            <h2 className="fw-bold">Welcome to Your Kitchen Helper</h2>
                            <p className="text-secondary mt-3">
                                This is the side row. You can add login, sign-up buttons, or description text here.
                            </p>
                        </Col>

                    </Row>
                </Container>

            </div>
    }

    return null;
}