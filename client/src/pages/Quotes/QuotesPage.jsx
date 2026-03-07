import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllQuotes, createQuote } from "../../services/quote";
import "./QuotesPage.css";

const systemQuotes = [
  {
    text: "The world is a book and those who do not travel read only one page.",
    author: "Saint Augustine",
    category: "Philosophy",
    image: "https://www.southernliving.com/thmb/uC9lfdB-vpeXk1XuxT12bII4EQc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1474089369-d2b0855436be4074ae986429058bf15c.jpg"
  },
  {
    text: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=800"
  },
  {
    text: "To travel is to live.",
    author: "Hans Christian Andersen",
    category: "Life",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&w=800"
  },
  {
    text: "Blessed are the curious for they shall have adventures.",
    author: "Lovelle Drachman",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&w=800"
  },
  {
    text: "Nature never goes out of style.",
    author: "Unknown",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&w=800"
  },
  {
    text: "Heaven is under our feet as well as over our heads.",
    author: "Henry David Thoreau",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&w=800"
  },
  {
    text: "Travel makes one modest. You see what a tiny place you occupy in the world.",
    author: "Gustave Flaubert",
    category: "Wisdom",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&w=800"
  },
  {
    text: "The journey not the arrival matters.",
    author: "T.S. Eliot",
    category: "Wisdom",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&w=800"
  },
  {
    text: "Go where you feel most alive.",
    author: "Unknown",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&w=800"
  },
  {
    text: "Adventure is worthwhile in itself.",
    author: "Amelia Earhart",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&w=800"
  },
  {
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "Motivation",
    image: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&w=800"
  },
  {
    text: "Life is a journey, not a destination.",
    author: "Ralph Waldo Emerson",
    category: "Philosophy",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&w=800"
  },
  {
    text: "The mountains are calling and I must go.",
    author: "John Muir",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&w=800"
  },
  {
    text: "Jobs fill your pockets, but adventures fill your soul.",
    author: "Jaime Lyn Beatty",
    category: "Life",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&w=800"
  }
];

const QuotesPage = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageOptions = [
    "https://www.southernliving.com/thmb/uC9lfdB-vpeXk1XuxT12bII4EQc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1474089369-d2b0855436be4074ae986429058bf15c.jpg",
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format"
  ];

  const [newQuote, setNewQuote] = useState({
    text: "",
    author: "",
    category: "Travel",
    image: imageOptions[0]
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    fetchQuotes();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllQuotes();
      if (response.data.data && response.data.data.length > 0) {
        setQuotes([...response.data.data, ...systemQuotes]);
      } else {
        setQuotes(systemQuotes);
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
      setQuotes(systemQuotes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareQuote = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      setError("Please login to share your travel wisdom!");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (newQuote.text.trim().length < 5) {
      setError("Quote text must be at least 5 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await createQuote(newQuote);
      // Fetch fresh quotes to include the new one properly
      await fetchQuotes();
      setShowModal(false);
      setNewQuote({ text: "", author: "", category: "Travel", image: imageOptions[0] });
    } catch (err) {
      console.error("Submission error:", err.response || err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to share quote. Please check your connection and try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredQuote = systemQuotes[Math.floor(Math.random() * systemQuotes.length)];

  return (
    <div className="quotes-page">
      {/* Navbar */}
      <nav className={`quotes-nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">TravelDiaries</span>
          </Link>
          <div className="nav-links">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/explore" className="nav-link">Explore</Link>
            <Link to="/quotes" className="nav-link active">Quotes</Link>
            <button className="nav-cta" onClick={() => navigate("/create")}>Write Story</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="quotes-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="featured-badge">Quote of the Day</div>
          <h1 className="featured-quote">"{featuredQuote.text}"</h1>
          <p className="featured-author">— {featuredQuote.author}</p>
          <div className="hero-actions">
            <button className="hero-share-btn" onClick={() => setShowModal(true)}>
              + Share a Quote
            </button>
          </div>
        </div>
      </header>

      <section className="quote-intro">
        <div className="container">
          <h2>Whispers of the Wild</h2>
          <p>A collection of timeless wisdom from the world's greatest explorers and our own community.</p>
        </div>
      </section>

      {/* Grid */}
      <main className="quotes-grid">
        {quotes.map((quote, index) => (
          <div key={quote._id || index} className="quote-card">
            <div 
              className="quote-bg" 
              style={{ backgroundImage: `url(${quote.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format"})` }}
            ></div>
            <div className="quote-overlay"></div>
            <div className="quote-category">{quote.category}</div>
            <div className="quote-content">
              <p className="quote-text">{quote.text}</p>
              <div className="quote-author">
                <span>{quote.author}</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Share Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setError(""); }}>
          <div className="quote-form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => { setShowModal(false); setError(""); }}>✕</button>
            <h2 className="modal-title">Share Your Wisdom</h2>
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}
            <form onSubmit={handleShareQuote}>
              <div className="form-group">
                <label className="form-label">The Quote</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="What's on your mind? (min 5 characters)" 
                  rows={4}
                  required
                  value={newQuote.text}
                  onChange={(e) => {
                    setError("");
                    setNewQuote({...newQuote, text: e.target.value});
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={newQuote.author}
                  onChange={(e) => setNewQuote({...newQuote, author: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input"
                  value={newQuote.category}
                  onChange={(e) => setNewQuote({...newQuote, category: e.target.value})}
                >
                  <option value="Travel">Travel</option>
                  <option value="Life">Life</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Nature">Nature</option>
                  <option value="Wisdom">Wisdom</option>
                  <option value="Motivation">Motivation</option>
                  <option value="Philosophy">Philosophy</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Image Background</label>
                <div className="image-picker">
                  {imageOptions.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Option ${index + 1}`}
                      className={`image-option ${newQuote.image === img ? 'selected' : ''}`}
                      onClick={() => setNewQuote({...newQuote, image: img})}
                    />
                  ))}
                </div>
              </div>
              <button 
                className="publish-btn" 
                type="submit" 
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? "Publishing..." : "Publish to Community"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesPage;
