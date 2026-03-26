import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function App() {
  const [feedback, setFeedback] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("5");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeedback() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/feedback`);
        if (!response.ok) throw new Error("Failed to fetch feedback.");
        const data = await response.json();
        setFeedback(data);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load feedback.");
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!message.trim()) {
      setError("Message is required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          rating: Number(rating),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to submit feedback.");
      }

      const savedItem = await response.json();

      setFeedback((current) => {
        const exists = current.some((entry) => entry.id === savedItem.id);
        return exists ? current : [savedItem, ...current];
      });

      setName("");
      setMessage("");
      setRating("5");
    } catch (submitError) {
      setError(submitError.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Feedback Wall</h1>
        <p>Share your feedback and view the latest submissions.</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name (optional)"
            />
          </label>

          <label>
            Feedback
            <textarea
              rows="4"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What did you think?"
              required
            />
          </label>

          <label>
            Rating
            <select value={rating} onChange={(event) => setRating(event.target.value)}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Needs improvement</option>
              <option value="1">1 - Poor</option>
            </select>
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Latest Feedback</h2>
        {loading ? <p>Loading feedback...</p> : null}

        {!loading && feedback.length === 0 ? (
          <p>No feedback yet. Be the first to submit.</p>
        ) : (
          <ul className="list">
            {feedback.map((item) => (
              <li key={item.id}>
                <div className="meta">
                  <strong>{item.name}</strong>
                  <span>{item.rating ? `${item.rating}/5` : "No rating"}</span>
                </div>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
