import { useInput } from "../Utility/useInput";
import "./Login.css";

function Login() {
  const username = useInput("text");
  const password = useInput("password");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`username: ${username.value}, password: ${password.value}`);
  };
  return (
    <>
      <h3>Bienvenue</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        Utilisateur: <input {...username} />
        Mot de passe <input {...password} />
        <button>Login</button>
      </form>
    </>
  );
}

export default Login;
