import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import SERVER_URL from "../../server_config";

export default function AddRecipesPage({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [ingredientsInput, setIngredientsInput] = useState("");

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
                const data = await res.json();
                setRecipes(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchRecipes();
    }, [userId]);

    // Add / Update Recipe
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
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
        // formData.forEach((value, key) => {
        //     console.log(key, ":", value);
        // });

        try {
            await fetch(url, { method, body: formData });

            // Close modal
            setShowModal(false);

            // Reset fields
            setNewRecipe(emptyRecipe);
            setIngredientsInput("");

            // Refresh recipes
            const res = await fetch(`${SERVER_URL}/get-own-recipes/${userId}`);
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Delete a recipe
    const handleDelete = async (id) => {
        try {
            const userId = localStorage.getItem("userId");
            await fetch(`${SERVER_URL}/add-recipe/delete/${id}/${userId}`, { method: "DELETE" });
            setRecipes(recipes.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Filtered list for UI
    const filteredRecipes = recipes.filter(
        (r) =>
            r.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter ? r.category === categoryFilter : true)
    );

    return (
        <div className="container py-5">
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
                {filteredRecipes.map((r) => (
                    <Col key={r._id}>
                        <Card className="shadow-sm h-100">
                            {r.imageUrl && (
                                <Card.Img
                                    variant="top"
                                    src={r.imageUrl}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            )}

                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{r.name}</Card.Title>

                                <Card.Text className="mb-2">
                                    {r.category && <div><strong>Category:</strong> {r.category}</div>}
                                    {r.area && <div><strong>Area:</strong> {r.area}</div>}
                                    {r.tags && <div><strong>Tags:</strong> {r.tags}</div>}
                                </Card.Text>

                                <div className="mt-auto d-flex justify-content-between">
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(r._id)}
                                    >
                                        Delete
                                    </Button>

                                    <Button
                                        variant="secondary"
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
                        <Form.Group className="mb-3">
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
    );
}
