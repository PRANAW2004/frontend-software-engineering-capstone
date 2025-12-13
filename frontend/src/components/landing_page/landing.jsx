import useSWR from 'swr';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../../server_config';
import { Container, Row, Col, Button } from "react-bootstrap";

export default function LandingPage() {

    const fetcher = (url) =>
        fetch(url, { credentials: "include" }).then((res) => {
            if (!res.ok) throw new Error("Not logged in");
            return res.json();
        });

    const navigate = useNavigate();

    const { data, error, isLoading } = useSWR(
        `${SERVER_URL}/login-state`,
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            revalidateIfStale: false,
        }
    );
    useEffect(() => {
        if (!isLoading) {
            if (data?.loggedIn) {
                navigate("/homepage", { replace: true });
            }
        }
    }, [data, isLoading, navigate]);

    if (isLoading) return <p>Loading...</p>;

    if (!data?.loggedIn) {
        return <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#fafafa",
                paddingTop: "5rem",
            }}
        >
            <Container>
                <Row className="align-items-center mb-5">
                    <Col md={6} className="text-md-start text-center">
                        <h1 data-aos="fade-down" style={{ fontWeight: "800", fontSize: "3.5rem", color: "#2c3e50" }}>
                            Recipe Management System
                        </h1>

                        <p data-aos="fade-up" style={{ fontSize: "1.3rem", color: "#555", marginTop: "1rem" }}>
                            Your intelligent kitchen companion — store recipes, plan meals, and
                            cook smarter with AI-powered organization.
                        </p>

                        <div style={{ marginTop: "2rem" }}>
                            <Button data-aos="fade-right"
                                variant="primary"
                                size="lg"
                                style={{ padding: "0.75rem 2rem", fontWeight: "600", marginRight: "1rem" }}
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                            <Button data-aos="fade-left"
                                variant="success"
                                size="lg"
                                style={{ padding: "0.75rem 2rem", fontWeight: "600" }}
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </Col>

                    <Col md={6} className="text-center">
                        <img data-aos="fade-left"
                            src="./images/tablet-kitchen.jpg"
                            alt="tablet-kitchen"
                            className="img-fluid rounded shadow-lg"
                            style={{
                                maxHeight: "450px",
                                objectFit: "cover",
                            }}
                        />
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col className="text-center">
                        <h2 data-aos="fade-up" style={{ fontWeight: "700", color: "#34495e" }}>Why Use Our System?</h2>
                        <p data-aos="fade-up" style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
                            Designed for home cooks, students, food lovers, and professionals who want
                            structure, convenience, and creativity in the kitchen.
                        </p>
                    </Col>
                </Row>

                <Row className="mt-4 text-center">
                    <Col md={4}>
                        <div data-aos="zoom-in-right" className="p-4 shadow-sm rounded bg-white">
                            <h4 style={{ fontWeight: "700", color: "#2c3e50" }}>Organize Recipes</h4>
                            <p style={{ color: "#666" }}>
                                Save all your recipes in one place — add ingredients, steps, photos, and tags.
                            </p>
                        </div>
                    </Col>

                    <Col md={4}>
                        <div data-aos="zoom-in" className="p-4 shadow-sm rounded bg-white">
                            <h4 style={{ fontWeight: "700", color: "#2c3e50" }}>Smart Search</h4>
                            <p style={{ color: "#666" }}>
                                Quickly find dishes based on ingredients, categories, or your saved tags.
                            </p>
                        </div>
                    </Col>

                    <Col md={4}>
                        <div data-aos="zoom-in-left" className="p-4 shadow-sm rounded bg-white">
                            <h4 style={{ fontWeight: "700", color: "#2c3e50" }}>Meal Planning</h4>
                            <p style={{ color: "#666" }}>
                                Plan your weekly meals effortlessly and reduce food waste.
                            </p>
                        </div>
                    </Col>
                </Row>

                <Row className="mt-5 mb-5">
                    <Col className="text-center">
                        <div className="p-5 bg-primary text-white rounded shadow">
                            <h2 data-aos="fade-right" style={{ fontWeight: "700" }}>Start Cooking Smarter Today</h2>
                            <p data-aos="fade-left" style={{ fontSize: "1.2rem", marginTop: "10px" }}>
                                Join thousands of users who cook confidently with organized recipes and smart planning tools.
                            </p>
                            <Button data-aos="zoom-in"
                                variant="light"
                                size="lg"
                                style={{ padding: "0.75rem 2rem", fontWeight: "600" }}
                                onClick={() => navigate("/signup")}
                            >
                                Create Free Account
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>

    }

    return null;
}