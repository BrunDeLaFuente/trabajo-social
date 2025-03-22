import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const { login } = useContext(AuthContext);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
        } catch {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
