import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Row, Col, InputGroup, ToastContainer, Toast } from "react-bootstrap";
import SERVER_URL from "../../server_config";
import { useNavigate } from "react-router-dom";

export default function AddRecipesPage({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [ingredientsInput, setIngredientsInput] = useState("");

    const [loading, setLoading] = useState(true);

    // Toast Messages
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastVariant, setToastVariant] = useState("success");

    const emptyRecipe = {
        name: "",
        category: "",
        area: "",
        tags: "",
        ingredients: [],
        instructions: "",
        youtubeUrl: "",
        image: null,
    };

    const [newRecipe, setNewRecipe] = useState(emptyRecipe);

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const userId = localStorage.getItem("userId");
                const res = await fetch(`${SERVER_URL}/get-own-recipes/${userId}`);
                console.log(res.status);
                if (res.status !== 200){
                    window.location.href = `/error/${res.status}`;
                    
                }
                const data = await res.json();
                setRecipes(data);
            } catch (err) {
                console.error(err);
                setToastVariant("danger");
                setToastMessage("Failed to load recipes");
                setShowToast(true);
            }
            setLoading(false);
        }
        fetchRecipes();
    }, [userId]);

    // Add / Update Recipe
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setShowModal(false);
            throw new Error("User not logged in");
        }
        let parsedIngredients = [];
        try {
            parsedIngredients = JSON.parse(ingredientsInput || "[]");
        } catch {
            alert("Ingredients must be a valid JSON array.");
            return;
        }

        const formData = new FormData();
        Object.keys(newRecipe).forEach((key) => {
            if (key === "ingredients")
                formData.append(key, JSON.stringify(parsedIngredients));
            else
                formData.append(key, newRecipe[key]);
        });
        formData.append("userId", userId);

        const url = newRecipe._id
            ? `${SERVER_URL}/add-recipe/${newRecipe._id}`
            : `${SERVER_URL}/add-recipe`;

        const method = newRecipe._id ? "PUT" : "POST";

        try {
            const response = await fetch(url, { method, body: formData });

            if (!response.ok) {
                console.log(response.status);
            setShowModal(false);
                throw new Error('Failed to save recipe');

            }

            setToastVariant("success");
            setToastMessage(newRecipe._id ? "Recipe updated successfully!" : "Recipe added successfully!");
            setShowToast(true);

            setShowModal(false);
            setNewRecipe(emptyRecipe);
            setIngredientsInput("");

            // Refresh recipes
            const res = await fetch(`${SERVER_URL}/get-own-recipes/${userId}`);
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            console.error(err);
            setToastVariant("danger");
            setToastMessage("Error adding/updating recipe");
            setShowToast(true);
        }
    };

    // Delete a recipe
    const handleDelete = async (id) => {
        try {
            const userId = localStorage.getItem("userId");
            await fetch(`${SERVER_URL}/add-recipe/delete/${id}/${userId}`, { method: "DELETE" });
            setRecipes(recipes.filter((r) => r._id !== id));

            setToastVariant("success");
            setToastMessage("Recipe deleted successfully!");
            setShowToast(true);
        } catch (err) {
            console.error(err);
            setToastVariant("danger");
            setToastMessage("Failed to delete recipe");
            setShowToast(true);
        }
    };

    // Filtered list for UI
    const filteredRecipes = recipes.filter(
        (r) =>
            r.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter ? r.category === categoryFilter : true)
    );



    return (<>
        {loading && (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        )}

        {!loading && (<div className="container py-5">
            {/* Toast Notification */}
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            <h2 className="mb-4">🍽 My Recipes</h2>

            {/* Search + Filter */}
            <Row className="mb-3">
                <Col md={6}>
                    <InputGroup>
                        <Form.Control
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>

                <Col md={3}>
                    <Form.Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {[...new Set(recipes.map((r) => r.category).filter(Boolean))].map(
                            (cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            )
                        )}
                    </Form.Select>
                </Col>
            </Row>

            {/* Recipe Grid */}
            <Row xs={1} md={3} className="g-4">
                {filteredRecipes.map((r, index) => (
                    <Col key={r._id}>
                        <Card data-aos="fade-up" data-aos-delay={index * 300} className="shadow-sm h-100 rounded-4 overflow-hidden border-0"
                            style={{
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-10px) scale(1.03)";
                                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)";
                            }}
                        >

                            {/* Image Header */}
                            {r.imageUrl ? (
                                <Card.Img
                                    variant="top"
                                    src={r.imageUrl}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    style={{
                                        height: "200px",
                                        background: "#f8f9fa",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#999",
                                        fontSize: "18px",
                                        fontWeight: "500",
                                    }}
                                >
                                    No Image Available
                                </div>
                            )}

                            {/* Body with border */}
                            <Card.Body
                                className="d-flex flex-column"
                                style={{
                                    border: "3px solid #ddd",           // visible border
                                    borderTop: "none",                  // avoid double-border at top
                                    borderRadius: "0 0 1rem 1rem",      // rounded bottom corners
                                    padding: "1rem 1.2rem",
                                }}
                            >
                                <Card.Title className="fw-bold mb-2">{r.name}</Card.Title>

                                <Card.Text className="text-muted small mb-3">
                                    {r.category && <div><strong>Category:</strong> {r.category}</div>}
                                    {r.area && <div><strong>Area:</strong> {r.area}</div>}
                                    {r.tags && <div><strong>Tags:</strong> {r.tags}</div>}
                                </Card.Text>

                                <div className="mt-auto d-flex justify-content-between gap-2">

                                    <Button
                                        variant="primary"
                                        className="w-100"
                                        onClick={() => {
                                            navigate(`/recipes/own/${r._id}`)
                                        }}
                                    >
                                        View
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        className="w-100"
                                        onClick={() => {
                                            setShowModal(true);
                                            setNewRecipe({ ...r });
                                            setIngredientsInput(
                                                JSON.stringify(r.ingredients || [], null, 2)
                                            );
                                        }}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="danger"
                                        className="w-100"
                                        onClick={() => handleDelete(r._id)}
                                    >
                                        Delete
                                    </Button>

                                </div>
                            </Card.Body>
                        </Card>
                    </Col>


                ))}
            </Row>

            {/* Floating Add Button */}
            <Button
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                }}
                onClick={() => {
                    setShowModal(true);
                    setNewRecipe(emptyRecipe);
                    setIngredientsInput(""); // Placeholder now works
                }}
            >
                +
            </Button>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {newRecipe._id ? "Edit Recipe" : "Add Recipe"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Name & Category */}
                        <Row className="mb-3">
                            <Col>
                                <Form.Control
                                    placeholder="Name"
                                    value={newRecipe.name}
                                    required
                                    onChange={(e) =>
                                        setNewRecipe({ ...newRecipe, name: e.target.value })
                                    }
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    placeholder="Category"
                                    value={newRecipe.category}
                                    onChange={(e) =>
                                        setNewRecipe({ ...newRecipe, category: e.target.value })
                                    }
                                />
                            </Col>
                        </Row>

                        {/* Area & Tags */}
                        <Row className="mb-3">
                            <Col>
                                <Form.Control
                                    placeholder="Area"
                                    value={newRecipe.area}
                                    onChange={(e) =>
                                        setNewRecipe({ ...newRecipe, area: e.target.value })
                                    }
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    placeholder="Tags"
                                    value={newRecipe.tags}
                                    onChange={(e) =>
                                        setNewRecipe({ ...newRecipe, tags: e.target.value })
                                    }
                                />
                            </Col>
                        </Row>

                        {/* Ingredients */}
                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients (JSON Array)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder='[{"ingredient":"Flour","measure":"1 cup"}]'
                                value={ingredientsInput}
                                onChange={(e) => setIngredientsInput(e.target.value)}
                            />
                        </Form.Group>

                        {/* Instructions */}
                        <Form.Group className="mb-3" controlId="instructions">
                            <Form.Label>Instructions</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={newRecipe.instructions}
                                onChange={(e) =>
                                    setNewRecipe({ ...newRecipe, instructions: e.target.value })
                                }
                            />
                        </Form.Group>

                        {/* YouTube URL */}
                        <Form.Group className="mb-3">
                            <Form.Label>YouTube URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={newRecipe.youtubeUrl}
                                onChange={(e) =>
                                    setNewRecipe({ ...newRecipe, youtubeUrl: e.target.value })
                                }
                            />
                        </Form.Group>

                        {/* Image Upload */}
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) =>
                                    setNewRecipe({
                                        ...newRecipe,
                                        image: e.target.files[0],
                                    })
                                }
                            />
                        </Form.Group>

                        <Button type="submit" variant="success">
                            {newRecipe._id ? "Update Recipe" : "Add Recipe"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        )}
    </>
    );
}
