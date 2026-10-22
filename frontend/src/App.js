import React, { useState } from "react";

function App() {
  const [genre, setGenre] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

 
const API_URL = "/api"; 


  async function handleRecommend() {
    if (!genre) {
      setError("Please enter a genre");
      return;
    }
    setError("");
    try {
      const response = await fetch(`${API_URL}/books?genre=${encodeURIComponent(genre)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch from backend");
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching books. Check backend URL!");
      setBooks([]);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📚 Book Recommender</h1>
      <input
        type="text"
        placeholder="Enter a genre (e.g., Fantasy)"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <button onClick={handleRecommend}>Get Recommendations</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> — {b.author} ({b.genre})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
