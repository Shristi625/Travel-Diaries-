import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTravelDiaryById } from "../../../services/travel-diary";
import "./DiaryDetails.css";

const UserDiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getFullImageUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  useEffect(() => {
    setIsLoading(true);
    getTravelDiaryById(id)
      .then((res) => {
        setDiary(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to load diary:", err);
        setError("Could not load your story. It might have been deleted or moved.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Opening your journal...</p>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="error-container">
        <h2>Oops!</h2>
        <p>{error || "Diary not found"}</p>
        <button 
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="diary-page-wrapper">
      {/* Navigation */}
      <nav className="diary-navbar">
        <div className="navbar-content">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="navbar-logo">
            <span className="logo-text">TravelDiaries</span>
            <div className="logo-subtext">Premium Memoir</div>
          </div>
          <div className="navbar-actions">
            <button className="nav-action" onClick={() => window.print()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image-container">
          <img
            src={getFullImageUrl(diary.coverImage || (diary.images && diary.images[0]))}
            alt={diary.title}
            className="hero-image"
          />
          <div className="image-overlay"></div>
        </div>
        <div className="hero-text">
          <span className="hero-location">📍 {diary.location}</span>
          <h1 className="hero-title">{diary.title}</h1>
          <div className="hero-date">
            {new Date(diary.travelDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="diary-main-content">
        <div className="content-container">
          {/* Introduction/Story */}
          <section className="diary-intro">
            <h2 className="section-title">The Journey</h2>
            <div className="story-content">
              {diary.story.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* Image Gallery */}
          {diary.images && diary.images.length > 1 && (
            <section className="image-section">
              <h3 className="image-section-title">Visual Memories</h3>
              <div className="image-grid-2col">
                {diary.images.slice(1).map((image, index) => (
                  <div key={index} className="image-card">
                    <img src={getFullImageUrl(image)} alt={`Gallery ${index + 1}`} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reflections */}
          <section className="conclusion-section">
            <h3 className="conclusion-title">Reflections</h3>
            <div className="conclusion-content">
              <p>
                This memory was documented on {new Date(diary.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}. 
                It remains a {diary.isPublic ? "public chapter" : "private treasure"} in your collection.
              </p>
              <div className="final-thought">
                "Every journey is a story waiting to be told, and some chapters are too beautiful to ever forget."
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <div className="action-footer">
            <button 
              className="primary-btn"
              onClick={() => navigate(`/edit/${diary._id}`)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Refine this Entry
            </button>
          </div>
        </div>
      </main>

      <footer className="diary-footer" style={{ marginTop: '0', background: 'white', color: '#888', borderTop: '1px solid #eee' }}>
        <div className="footer-content">
          <p className="footer-text">
            Travel Diaries · Preserving the soul of your explorations.
          </p>
          <div className="footer-links">
            <span>© 2024 TravelDiaries</span>
            <span>•</span>
            <button onClick={() => navigate("/dashboard")} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: '600' }}>Explore Collection</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDiaryDetail;

