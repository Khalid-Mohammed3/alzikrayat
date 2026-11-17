import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Write a comment first.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await onSubmit(text);
      setText("");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.errors?.[0] || data?.message || "Could not post the comment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        rows={2}
        maxLength={500}
      />
      <button className="btn" type="submit" disabled={sending}>
        {sending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}