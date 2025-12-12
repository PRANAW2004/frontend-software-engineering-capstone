import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import SERVER_URL from "../../server_config";
import { useNavigate } from "react-router-dom";

export default function RecipiesPage() {

    const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [newRecipe, setNewRecipe] = useState({
//     name: "", category: "", area: "", tags: "", ingredients: [], instructions: "", youtubeUrl: "", image: null
//   });

useEffect(() => {
  async function fetchRecipes() {
    try {
      const apiRes = await fetch(`${SERVER_URL}/api/recipes/random`);
      const apiData = await apiRes.json();

      // Normalize API data
      const normalizedApiData = apiData.map(r => ({
        id: r.idMeal,
        name: r.name || r.strMeal,
        category: r.category || r.strCategory,
        area: r.area || r.strArea,
        tags: r.tags || r.strTags,
        imageUrl: r.imageUrl || r.strMealThumb,
        instructions: r.instructions || r.strInstructions,
        youtubeUrl: r.youtubeUrl || r.strYoutube
      }));

      setRecipes([...normalizedApiData]);
    } catch (err) {
      console.error(err);
    }
  }
  fetchRecipes();
}, []);

  // Add recipe handler
//   const handleAddRecipe = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(newRecipe).forEach(key => {
//       if (key === "ingredients") {
//         formData.append(key, JSON.stringify(newRecipe[key]));
//       } else {
//         formData.append(key, newRecipe[key]);
//       }
//     });
//     try {
//       await fetch(`${SERVER_URL}/api/recipes`, { method: "POST", body: formData });
//       setShowModal(false);
//       window.location.reload(); // simple way to refresh recipes
//     } catch (err) {
//       console.error(err);
//     }
//   };

  const filteredRecipes = recipes.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter ? r.category === categoryFilter : true)
  );

  return (
    <div className="container py-5">
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
        {/* <Col md={6} className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>Add Recipe</Button>
        </Col> */}
      </Row>

      <Row xs={1} md={3} className="g-4">
        {filteredRecipes.map((r, idx) => (
          <Col key={idx}>
            <Card className="shadow-sm">
              {r.imageUrl || r.strMealThumb ? (
                <Card.Img variant="top" src={r.imageUrl || r.strMealThumb} style={{ height: "200px", objectFit: "cover" }} />
              ) : null}
              <Card.Body>
                <Card.Title>{r.name || r.strMeal}</Card.Title>
                <Card.Text>
                  {r.category && <span><strong>Category:</strong> {r.category} <br /></span>}
                  {r.area && <span><strong>Area:</strong> {r.area}</span>}
                </Card.Text>
                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => navigate(`/recipes/type/${r.id}`)}
                                >
                                    View Recipe
                                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Recipe Modal */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddRecipe}>
            <Row className="mb-3">
              <Col>
                <Form.Control placeholder="Name" required onChange={e => setNewRecipe({...newRecipe, name: e.target.value})} />
              </Col>
              <Col>
                <Form.Control placeholder="Category" onChange={e => setNewRecipe({...newRecipe, category: e.target.value})} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control placeholder="Area" onChange={e => setNewRecipe({...newRecipe, area: e.target.value})} />
              </Col>
              <Col>
                <Form.Control placeholder="Tags (comma separated)" onChange={e => setNewRecipe({...newRecipe, tags: e.target.value})} />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Ingredients (JSON Array)</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder='[{"ingredient":"Flour","measure":"1 cup"}]' onChange={e => setNewRecipe({...newRecipe, ingredients: JSON.parse(e.target.value)})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control as="textarea" rows={5} onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>YouTube URL</Form.Label>
              <Form.Control type="text" onChange={e => setNewRecipe({...newRecipe, youtubeUrl: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={e => setNewRecipe({...newRecipe, image: e.target.files[0]})} />
            </Form.Group>
            <Button type="submit" variant="success">Add Recipe</Button>
          </Form>
        </Modal.Body>
      </Modal> */}
    </div>
  );
}
