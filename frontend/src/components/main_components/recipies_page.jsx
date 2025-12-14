import { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import SERVER_URL from "../../server_config";
import { useNavigate } from "react-router-dom";

export default function RecipiesPage() {

  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const apiRes = await fetch(`${SERVER_URL}/api/recipes/random`);
        console.log(apiRes.status);
        if (apiRes.status !== 200){
          window.location.href = `/error/${apiRes.status}`;
          return;
        }
        const apiData = await apiRes.json();

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

  const filteredRecipes = recipes.filter(r =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter ? r.category === categoryFilter : true)
  );

  return (
    <div className="container py-5">
      <Row className="mb-3">
        <Col md={6}>
          <h1>Recipies</h1>
          <InputGroup>
            <Form.Control
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <Row xs={1} md={3} className="g-4">
        {filteredRecipes.map((r, idx) => (
          <Col key={idx}>
            <Card data-aos="zoom-in" className="shadow-sm"
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
    </div>
  );
}
