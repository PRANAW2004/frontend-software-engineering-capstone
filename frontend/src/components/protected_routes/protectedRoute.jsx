
import { Navigate } from "react-router-dom";
import useSWR from "swr";
import SERVER_URL from "../../server_config";

const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) return null;
    return res.json();
  });

export default function ProtectedRoute({ children }) {
  const { data, error, isLoading } = useSWR(
        `${SERVER_URL}/login-state`,
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
            revalidateIfStale: false,
        }
    );

  if (isLoading) return <p>Loading...</p>;
  if (!data?.loggedIn) return <Navigate to="/" replace />;

  return children;
}
