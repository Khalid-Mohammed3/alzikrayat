import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="card">
      <h1>Alzikrayat</h1>
      <p>Share your photo memories and comment on the memories of others.</p>
      {user ? (
        <p>Welcome back, {user.firstName}!</p>
      ) : (
        <Link className="btn" to="/login">Get started</Link>
      )}
    </section>
  );
}