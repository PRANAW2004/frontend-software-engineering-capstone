import ErrorPage from "./errorWrapper";
import { useParams } from "react-router-dom";

export default function ErrorWrapper() {
  const { code } = useParams();
  return <ErrorPage code={code} />;
}

