import SERVER_URL from "../../server_config";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, Col } from 'react-bootstrap';

export default function HomePage() {

    const navigate = useNavigate();

    async function LogOut() {
        try {
            const response = await fetch(`${SERVER_URL}/logout`, { method: "POST", credentials: "include" });
            console.log(response.status);
            if (response.status !== 200){
                window.location.href = `/error/${response.status}`
            }
            await mutate(`${SERVER_URL}/login-state`, undefined, { revalidate: true });
            navigate("/", { replace: true });
        } catch (err) {
            console.log(err.status);
        }
    }

    const [chatOpen, setChatOpen] = useState(false);
    const [chat, setChat] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function sendMessage() {
        if (!input.trim()) return;

        const newChat = [...chat, { sender: "user", text: input }];
        setChat(newChat);
        setLoading(true);

        const res = await fetch(`${SERVER_URL}/api/cookbot`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });
        console.log(res.status);
        if (res.status !== 200){
            setChat([...newChat, {sender: "bot",text:"Unknown Error Occured, Please try again"}]);
            setLoading(false);
            return;
        }
        const data = await res.json();
        

        setChat([...newChat, { sender: "bot", text: data.reply }]);
        setInput("");
        setLoading(false);
    }

    const categories = [
        {
            title: "Breakfast",
            desc: "Start your day with healthy and delicious recipes.",
            img: "./images/breakfast.jpg",
            route: "Breakfast",
        },
        {
            title: "Vegan",
            desc: "Delicious meals made entirely from plants—no animal products, just pure goodness.",
            img: "./images/vegan.jpg",
            route: "Vegan",
        },
        {
            title: "Vegeterian",
            desc: "A vegetarian diet focuses on plant-based foods while avoiding meat, poultry, and seafood.",
            img: "./images/vegetarian.jpg",
            route: "Vegetarian",
        },
    ];


    return <div id="homepage-main">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <a className="navbar-brand fw-bold" href="/homepage">
                🍽️ RecipeMaster
            </a>
            <div className="ms-auto">
                <button className="btn btn-danger" onClick={LogOut}>
                    Log Out
                </button>
            </div>
        </nav>

        {/* HERO */}
        <section
            className="hero text-center d-flex align-items-center justify-content-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "70vh",
                color: "white",
                textShadow: "0 4px 10px rgba(0,0,0,0.6)",
            }}
        >
            <div>
                <h1 data-aos="fade-right" className="display-4 fw-bold">Discover. Cook. Enjoy.</h1>
                <p data-aos="fade-left" className="fs-4 mt-3">
                    Manage recipes, explore flavors, and craft your perfect dishes.
                </p>
                <Col>
                    <a data-aos="zoom-in" id="start-explore" href="/recipes"  className="btn btn-warning btn-lg mt-3 me-5">
                        Start Exploring Recipes
                    </a>
                    <a data-aos="zoom-in" id="add-recipe" href="/recipes/own" className="btn btn-primary btn-lg mt-3">
                        Add your own Recipe
                    </a>
                </Col>

            </div>
        </section>

        {/* CATEGORIES */}
        <div className="container my-5">
            <h2 data-aos="fade-right" className="mb-4 fw-bold">Popular Categories</h2>

            <div className="row g-4">
                {categories.map((cat, index) => (
                    <div className="col-md-4" key={index}>
                        <Card
                            className="shadow-sm border-0 clickable-card"
                            style={{ borderRadius: "15px", cursor: "pointer" }}
                            onClick={() => navigate(`/recipes/${cat.route}`)}
                            data-aos="fade-up"
                            data-aos-delay={index * 300}
                        >
                            <Card.Img
                                variant="top"
                                src={cat.img}
                                style={{
                                    height: "200px",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "15px",
                                    borderTopRightRadius: "15px",
                                }}
                            />
                            <Card.Body>
                                <Card.Title className="fw-bold">{cat.title}</Card.Title>
                                <Card.Text>{cat.desc}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>

        {/* FEATURED RECIPES */}
        <div className="container my-5">
            <h2 data-aos="fade-left" className="mb-4 fw-bold">Featured Recipes</h2>

            <div className="row g-4">
                {/* CARD */}
                <div data-aos="fade-up" data-aos-delay={0} className="col-md-4">
                    <div className="card shadow-sm">
                        <img
                            src="https://www.themealdb.com//images//media//meals//wvqpwt1468339226.jpg"
                            className="card-img-top"
                            style={{ height: "180px", objectFit: "cover" }}
                            alt="Recipe 1"
                        />
                        <div className="card-body">
                            <h5 className="card-title fw-bold">Mediterranean Pasta Salad</h5>
                            <p className="card-text">
                                A comforting, easy pasta dish loaded with flavor.
                            </p>
                            <a href="/recipes/type/52777" className="btn btn-primary btn-sm">
                                View Recipe
                            </a>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay={300} className="col-md-4">
                    <div className="card shadow-sm">
                        <img
                            src="https://www.themealdb.com//images//media//meals//wyxwsp1486979827.jpg"
                            className="card-img-top"
                            style={{ height: "180px", objectFit: "cover" }}
                            alt="Recipe 2"
                        />
                        <div className="card-body">
                            <h5 className="card-title fw-bold">Chicken Handi</h5>
                            <p className="card-text">
                                Perfectly cooked chicken with rich seasoning.
                            </p>
                            <a href="/recipes/type/52795" className="btn btn-primary btn-sm">
                                View Recipe
                            </a>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay={600} className="col-md-4">
                    <div className="card shadow-sm">
                        <img
                            src="https://www.themealdb.com//images//media//meals//xrrwpx1487347049.jpg"
                            className="card-img-top"
                            style={{ height: "180px", objectFit: "cover" }}
                            alt="Recipe 3"
                        />
                        <div className="card-body">
                            <h5 className="card-title fw-bold">Ribollita</h5>
                            <p className="card-text">
                                Ribollita is a traditional Tuscan vegetable and bread soup, hearty and comforting.
                            </p>
                            <a href="/recipes/type/52811" className="btn btn-primary btn-sm">
                                View Recipe
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            onClick={() => setChatOpen(true)}
            style={{
                position: "fixed",
                bottom: "25px",
                right: "25px",
                backgroundColor: "#ff9800",
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "30px",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                zIndex: 9999
            }}
        >
            💬
        </div>

        {chatOpen && (
            <div
                style={{
                    position: "fixed",
                    bottom: "100px",
                    right: "25px",
                    width: "350px",
                    height: "450px",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                    zIndex: 10000,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        background: "#ff9800",
                        padding: "12px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px"
                    }}
                >
                    🍳 CookMate
                    <span
                        onClick={() => setChatOpen(false)}
                        style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            fontWeight: "bold"
                        }}
                    >
                        ×
                    </span>
                </div>

                <div
                    style={{
                        flex: 1,
                        padding: "10px",
                        overflowY: "auto",
                        background: "#fffaf0",
                    }}
                >
                    {chat.map((msg, idx) => (
                        <p
                            key={idx}
                            style={{
                                textAlign: msg.sender === "user" ? "right" : "left",
                                background: msg.sender === "user" ? "#d6e4ff" : "#e8ffe6",
                                padding: "8px 12px",
                                borderRadius: "10px",
                                marginBottom: "10px",
                                display: "inline-block",
                                maxWidth: "80%"
                            }}
                        >
                            {msg.text}
                        </p>
                    ))}

                    {loading && (
                        <p style={{ color: "gray", fontStyle: "italic" }}>Cooking response...</p>
                    )}
                </div>

                <div
                    style={{
                        padding: "10px",
                        borderTop: "1px solid #ddd",
                        display: "flex",
                        gap: "6px"
                    }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a cooking question..."
                        style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        className="btn btn-warning"
                    >
                        Send
                    </button>
                </div>
            </div>
        )}


        <footer className="bg-dark text-white text-center p-3 mt-5">
            <p className="m-0">© 2025 RecipeMaster • Cook with Passion ❤️</p>
        </footer>
    </div>
}