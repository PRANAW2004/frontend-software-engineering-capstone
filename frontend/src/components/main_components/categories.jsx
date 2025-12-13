import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import SERVER_URL from "../../server_config";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {

    const navigate = useNavigate();

    const { category } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(category);
    useEffect(() => {
        async function fetchRecipes() {
            try {
                const response = await fetch(`${SERVER_URL}/recipes/${category}`);
                const data = await response.json();
                setRecipes(data.meals || []);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        }

        fetchRecipes();
    }, [category]);

    if (loading) return (
      <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"  // full viewport height
    }}
  >
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
  );

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4">🍽 {category} Recipes</h2>

            <div className="row g-4">
                {recipes.map((meal) => (
                    <div className="col-md-4" key={meal.idMeal}>
                        <Card
                            className="shadow-sm"
                            style={{
                                borderRadius: "15px",
                                border: "2px solid #ddd"   // Visible border
                            }}
                        >
                            <Card.Img
                                src={meal.strMealThumb}
                                style={{
                                    height: "200px",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "13px",
                                    borderTopRightRadius: "13px"
                                }}
                            />

                            <Card.Body className="text-center">
                                <Card.Title className="fw-bold">{meal.strMeal}</Card.Title>

                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => navigate(`/recipes/type/${meal.idMeal}`)}
                                >
                                    View Recipe
                                </button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

        </div>
    );
}