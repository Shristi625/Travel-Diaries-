import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateDiary.css";
import { createTravelDiary, getTravelDiaryById, updateTravelDiary } from "../../services/travel-diary";

const CreateDiary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [diary, setDiary] = useState({
    title: "",
    location: "",
    date: "",
    content: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      getTravelDiaryById(id)
        .then((res) => {
          const data = res.data.data;
          setDiary({
            title: data.title,
            location: data.location,
            date: data.travelDate ? new Date(data.travelDate).toISOString().split('T')[0] : "",
            content: data.story,
          });
          // For images, we show existing ones as previews but they aren't File objects
          if (data.images && data.images.length > 0) {
            setImagePreviews(data.images);
            // We set existing images if the backend supports keeping them, 
            // but usually we send new ones. 
            // For now let's keep it simple.
          }
        })
        .catch((err) => {
          console.error("Failed to fetch diary for edit:", err);
          alert("Failed to load diary data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Add new files to existing images
    setImages((prev) => [...prev, ...files]);

    // Create previews for new files
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const submitDiary = async (status = "published") => {
    setIsSubmitting(true);
    try {
      // Create FormData to send files and data
      const formData = new FormData();
      formData.append("title", diary.title || "Untitled Draft");
      formData.append("location", diary.location);
      formData.append("travelDate", diary.date);
      formData.append("story", diary.content);
      formData.append("status", status);
      formData.append("isPublic", "false"); // Drafts and first-saves are private by default

      // Append all new images if any
      images.forEach((image) => {
        formData.append("diaryImages", image);
      });

      let response;
      if (isEditMode) {
        response = await updateTravelDiary(id, formData);
        alert(status === "draft" ? "Draft updated!" : "Diary updated successfully!");
      } else {
        if (status === "published" && images.length === 0) {
          alert("Please upload at least one image to publish.");
          setIsSubmitting(false);
          return;
        }
        response = await createTravelDiary(formData);
        alert(status === "draft" ? "Draft saved!" : "Diary published successfully!");
      }

      console.log("Diary processed:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to process diary:", error);
      alert(
        error.response?.data?.message ||
          "Failed to process diary. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!diary.title || !diary.content) {
      alert("Please enter a title and some story content before publishing.");
      return;
    }
    submitDiary("published");
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    submitDiary("draft");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading diary details...</p>
      </div>
    );
  }

  return (
    <div className="create-diary">
      {/* Same Navbar as Dashboard */}
      <nav className="diary-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">📖</span>
            <span className="logo-text">TravelDiaries</span>
          </div>

          <div className="nav-links">
            <a href="/" className="nav-link">
              Home
            </a>
            <a href="/dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/explore" className="nav-link">
              Explore
            </a>
            <a href="/quotes" className="nav-link">
              Quotes
            </a>
            <button className="nav-cta active">Write</button>
            <div className="profile-dropdown">
              <button className="profile-trigger">
                <span className="profile-avatar">🧑‍🦰</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Writing Space */}
      <main className="diary-main">
        <div className="diary-container">
          {/* Page Header */}
          <header className="page-header">
            <button className="back-button" onClick={handleBack}>
              ← Back
            </button>
            <h1 className="page-title">{isEditMode ? "Edit Your Travel Diary" : "Write a New Travel Diary"}</h1>
            <p className="page-subtitle">
              {isEditMode ? "Refine your memories and share them with the world." : "Capture your journey while it's still fresh."}
            </p>
          </header>

          {/* Cover Image Upload */}
          <section className="cover-section">
            <div className="cover-label">
              <h3>Travel Photos</h3>
              <p className="label-hint">Upload multiple images to set the mood for your story</p>
            </div>

            <div className="cover-upload">
              {imagePreviews.length > 0 ? (
                <div className="image-gallery">
                  <div className="gallery-grid">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="gallery-item">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="gallery-image"
                        />
                        <div className="gallery-overlay">
                          <button
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                            type="button"
                          >
                            ✕ Remove
                          </button>
                        </div>
                        {index === 0 && <span className="cover-badge">Cover</span>}
                      </div>
                    ))}
                  </div>
                  <label className="add-more-label">
                    <div className="add-more-box">
                      <div className="add-icon">+</div>
                      <div className="add-text">Add more photos</div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                  </label>
                </div>
              ) : (
                <label className="upload-area">
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">
                    <div className="upload-title">Upload photos</div>
                    <div className="upload-hint">Select multiple images (JPG, PNG up to 5MB each)</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                </label>
              )}
            </div>
          </section>

          {/* Basic Information */}
          <section className="info-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Diary Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={diary.title}
                  onChange={handleInputChange}
                  className="form-input title-input"
                  placeholder="Give your diary a meaningful title"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={diary.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Where did this journey take place?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Travel Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={diary.date}
                  onChange={handleInputChange}
                  className="form-input date-input"
                />
              </div>
            </div>
          </section>

          {/* Story Editor - Most Important */}
          <section className="editor-section">
            <div className="editor-label">
              <h3>Your Story</h3>
              <p className="label-hint">Write from the heart</p>
            </div>

            <div className="editor-container">
              <textarea
                id="content"
                name="content"
                value={diary.content}
                onChange={handleInputChange}
                className="story-editor"
                placeholder="Start writing about your journey…
                
Begin with what you felt when you arrived…
Describe the sounds, smells, and sights…
Share the moments that moved you…
                
Don't worry about perfection – just write."
                rows={20}
              />
              <div className="editor-footer">
                <span className="character-count">
                  {diary.content.length} characters
                </span>
                <span className="word-count">
                  {
                    diary.content.split(/\s+/).filter((word) => word.length > 0)
                      .length
                  }{" "}
                  words
                </span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="actions-section">
            <div className="action-buttons">
              <button
                className="secondary-button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? "Saving..." : "Save Draft"}
              </button>
              <button
                className="primary-button"
                onClick={handlePublish}
                disabled={isSubmitting || !diary.title || !diary.content}
                type="button"
              >
                {isSubmitting ? "Processing..." : (isEditMode ? "Save Changes" : "Publish Diary")}
              </button>
            </div>
            <p className="action-hint">
              Your diary will be added to your collection
            </p>
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="diary-footer">
        <p>TravelDiaries · Your stories deserve to be told</p>
      </footer>
    </div>
  );
};

export default CreateDiary;
