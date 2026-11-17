import { Link } from "react-router-dom";

export default function PhotoCard({ photo, canDelete, onDelete }) {
  const owner = photo.userId;

  return (
    <article className="photo-card">
      <Link to={`/photos/${photo._id}`}>
        <img src={`/uploads/${photo.fileName}`} alt={photo.title} />
      </Link>
      <div className="photo-info">
        <h3>{photo.title}</h3>
        <p className="muted">
          {owner ? `${owner.firstName} ${owner.lastName}` : "Unknown"} ·{" "}
          {new Date(photo.dateTime).toLocaleDateString()}
        </p>
        <div className="photo-actions">
          <Link className="btn-small" to={`/photos/${photo._id}`}>View</Link>
          {canDelete && (
            <button type="button" className="btn-small danger" onClick={() => onDelete(photo._id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}