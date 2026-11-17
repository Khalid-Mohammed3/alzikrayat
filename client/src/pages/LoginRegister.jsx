import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function LoginRegister() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/gallery"; // page the user wanted
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Already logged in: no need to see this page
  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      setErrors(data?.errors || [data?.message || "Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <section className="card auth-card">
      <h1>{isLogin ? "Login" : "Create account"}</h1>

      {errors.length > 0 && (
        <ul className="alert">
          {errors.map((msg) => <li key={msg}>{msg}</li>)}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <label>First name
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label>Last name
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
          </>
        )}
        <label>Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="switch">
        {isLogin ? "No account yet?" : "Already registered?"}{" "}
        <button type="button" className="link-btn" onClick={() => { setMode(isLogin ? "register" : "login"); setErrors([]); }}>
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </section>
  );
}