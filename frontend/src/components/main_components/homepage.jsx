import SERVER_URL from "../../server_config";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate();

    async function LogOut() {
        try {
            await fetch(`${SERVER_URL}/logout`, { method: "POST", credentials: "include" });
            mutate(`${SERVER_URL}/login-state`, { loggedIn: false }, false);
            navigate("/", { replace: true });
        } catch (err) {
            console.log(err);
        }
    }

    return <div>
        <button onClick={LogOut} >Sign Out</button>
    </div>
}