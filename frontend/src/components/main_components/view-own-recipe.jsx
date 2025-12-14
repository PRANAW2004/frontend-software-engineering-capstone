import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import SERVER_URL from "../../server_config";

export default function ViewOwnRecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`${SERVER_URL}/recipe/own/${id}`);
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchRecipe();
  }, [id]);

  if (loading) return (
      <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh" 
    }}
  >
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
  )

  if (!recipe) return <p>Recipe not found</p>;

  const youtubeEmbedUrl = recipe.youtubeUrl
    ? `https://www.youtube.com/embed/${recipe.youtubeUrl.split("v=")[1]}`
    : null;

  return (
    <div className="container py-5">

      <h2 className="fw-bold mb-3">{recipe.name}</h2>

      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="img-fluid rounded mb-4"
          style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
        />
      ) : (
        <div
          style={{
            height: "300px",
            background: "#f1f1f1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            marginBottom: "1rem"
          }}
        >
          No Image Available
        </div>
      )}

      <Card className="mb-4 p-3 shadow-sm">
        <p>
          <strong>Category:</strong> {recipe.category} |{" "}
          <strong>Area:</strong> {recipe.area} |{" "}
          <strong>Tags:</strong> {recipe.tags || "N/A"}
        </p>
      </Card>

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
            {recipe.ingredients?.map((item, index) => (
              <tr key={index}>
                <td>{item.ingredient}</td>
                <td>{item.measure}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mb-4 p-3 shadow-sm">
        <h4 className="fw-bold mb-3">Instructions</h4>
        <p style={{ whiteSpace: "pre-line" }}>{recipe.instructions}</p>
      </Card>

      {youtubeEmbedUrl && (
        <Card className="mb-4 p-3 shadow-sm">
          <h4 className="fw-bold mb-3">Video Tutorial</h4>
          <div className="ratio ratio-16x9">
            <iframe
              src={youtubeEmbedUrl}
              title={recipe.name}
              allowFullScreen
            ></iframe>
          </div>
        </Card>
      )}
    </div>
  );
}
