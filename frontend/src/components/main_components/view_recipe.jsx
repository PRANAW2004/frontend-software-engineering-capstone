import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import SERVER_URL from "../../server_config";

export default function ViewRecipePage() {
  const { type } = useParams(); // this should be idMeal for a single recipe
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
    console.log(type);
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(`${SERVER_URL}/recipes/type/${type}`); // your backend endpoint for single recipe
        const data = await response.json();
        console.log(data);
        setRecipe(data[0]); // take the first meal
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }

    fetchRecipe();
  }, [type]);

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

  if (!recipe) return <p>Recipe not found</p>;

  // Prepare ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({ ingredient, measure });
    }
  }

  // Extract YouTube video ID
  let youtubeEmbedUrl = null;
  if (recipe.strYoutube) {
    const videoId = recipe.strYoutube.split("v=")[1];
    youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <div className="container py-5">
      {/* Name and Image */}
      <h2 className="fw-bold mb-3">{recipe.strMeal}</h2>
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="img-fluid rounded mb-4"
        style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
      />

      {/* Basic Info */}
      <Card className="mb-4 p-3 shadow-sm">
        <p>
          <strong>Category:</strong> {recipe.strCategory} | <strong>Area:</strong>{" "}
          {recipe.strArea} | <strong>Tags:</strong> {recipe.strTags || "N/A"}
        </p>
      </Card>

      {/* Ingredients */}
      <Card className="mb-4 p-3 shadow-sm">
        <h4 className="fw-bold mb-3">Ingredients</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Measure</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((item, index) => (
              <tr key={index}>
                <td>{item.ingredient}</td>
                <td>{item.measure}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Instructions */}
      <Card className="mb-4 p-3 shadow-sm">
        <h4 className="fw-bold mb-3">Instructions</h4>
        <p style={{ whiteSpace: "pre-line" }}>{recipe.strInstructions}</p>
      </Card>

      {/* YouTube Video */}
      {youtubeEmbedUrl && (
        <Card className="mb-4 p-3 shadow-sm">
          <h4 className="fw-bold mb-3">Video Tutorial</h4>
          <div className="ratio ratio-16x9">
            <iframe
              src={youtubeEmbedUrl}
              title={recipe.strMeal}
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      )}
    </div>
  );
}
