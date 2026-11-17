import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import CommentForm from "../components/CommentForm";

export default function PhotoDetail() {
  const { id } = useParams(); // the :id from the URL /photos/:id
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reloads whenever the id in the URL changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/photos/${id}`);
        setPhoto(data.photo);
        setComments(data.comments);
      } catch (err) {
        const status = err.response?.status;
        setError(status === 404 || status === 400 ? "This photo does not exist." : "Could not load the photo.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addComment = async (text) => {
    const { data } = await api.post(`/photos/${id}/comments`, { comment: text });
    setComments((prev) => [...prev, data.comment]);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await api.delete(`/photos/${id}`);
      navigate("/gallery");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the photo.");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!photo) {
    return (
      <section className="card">
        <p className="alert">{error}</p>
        <Link className="btn" to="/gallery">Back to gallery</Link>
      </section>
    );
  }

  const owner = photo.userId;
  const isOwner = user && owner?._id === user.id;

  return (
    <section>
      <Link to="/gallery">&larr; Back to gallery</Link>

      {error && <p className="alert">{error}</p>}

      <article className="card detail">
        <img className="detail-img" src={`/uploads/${photo.fileName}`} alt={photo.title} />
        <h1>{photo.title}</h1>
        <p className="muted">
          {owner ? `${owner.firstName} ${owner.lastName}` : "Unknown"} ·{" "}
          {new Date(photo.dateTime).toLocaleString()}
        </p>
        {photo.description && <p>{photo.description}</p>}
        {isOwner && (
          <button type="button" className="btn-small danger" onClick={handleDelete}>
            Delete photo
          </button>
        )}
      </article>

      <div className="card comments">
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 && <p className="muted">No comments yet.</p>}
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c._id}>
              <strong>{c.userId ? `${c.userId.firstName} ${c.userId.lastName}` : "Unknown"}</strong>
              <span className="muted"> · {new Date(c.dateTime).toLocaleString()}</span>
              <p>{c.comment}</p>
            </li>
          ))}
        </ul>

        {user ? (
          <CommentForm onSubmit={addComment} />
        ) : (
          <p><Link to="/login">Login</Link> to leave a comment.</p>
        )}
      </div>
    </section>
  );
}