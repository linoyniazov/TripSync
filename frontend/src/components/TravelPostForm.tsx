import { useState, ChangeEvent, FormEvent } from "react";
import { Container, Form, Button } from "react-bootstrap";
import apiClient  from '../services/axiosInstance';
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ITravelPostFormState {
  city: string;
  description: string;
  location: string;
  photo: string[] | null;
  userId: string;
}

const TravelPostForm = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState<ITravelPostFormState>({
    city: "",
    description: "",
    location: "",
    photo: [],
    userId: "",
  });

  const [fileData, setFileData] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileData(Array.from(e.target.files));
    }
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await apiClient.post("/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");
    const config =
      token && userId
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        : {};

    if (!fileData.length) {
      setErrorMessage("Please select at least one photo.");
      return;
    }

    if (userId && token) {
      try {
        const photoUrls = await Promise.all(fileData.map(uploadPhoto));
        const postObject = {
          city: post.city,
          description: post.description,
          location: post.location,
          photos: photoUrls,
          userId: userId,
        };
        await apiClient.post("/post", postObject, config);
        setSuccessMessage("Your post is created successfully!");
        navigate("/profile");
      } catch (error) {
        console.error("There was an error submitting the post", error);
        setErrorMessage("There was an error submitting your post.");
      }
    }
  };

  return (
    <Container>
      <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-sm">
        <h2 className="mb-4" style={{ color: "var(--primary-color)" }}>Share Your Travel Story</h2>
        
        <Form onSubmit={handleSubmit}>
          <div className="d-flex gap-4">
            {/* Left Container - Photo Upload */}
            <div className="flex-1 bg-light rounded-lg p-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "200px" }}>
              <label htmlFor="photo" className="cursor-pointer text-center">
                <FaCamera size={50} className="mb-3" style={{ color: "var(--primary-color)" }} />
                <div className="text-muted mb-2">Click to upload photos</div>
                {fileData.length > 0 && (
                  <div className="text-success">
                    {fileData.length} {fileData.length === 1 ? 'photo' : 'photos'} selected
                  </div>
                )}
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handlePhotoChange}
                className="d-none"
                multiple
                accept="image/*"
              />
            </div>

            {/* Right Container - Form Fields */}
            <div className="flex-2">
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={post.city}
                  onChange={handleChange}
                  placeholder="Enter city name"
                  required
                  className="rounded-lg"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Your Story</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={4}
                  value={post.description}
                  onChange={handleChange}
                  placeholder="Share your travel experience..."
                  required
                  className="rounded-lg"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Location</Form.Label>
                <Form.Select
                  name="location"
                  value={post.location}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                >
                  <option value="">Select Region</option>
                  <option value="South America">South America</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Africa">Africa</option>
                  <option value="Asia">Asia</option>
                  <option value="Oceania">Oceania</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="alert alert-success mt-3">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger mt-3">{errorMessage}</div>
          )}

          {/* Buttons */}
          <div className="d-flex gap-3 justify-content-end mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/profile')}
              className="rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)"
              }}
              className="rounded-lg px-4"
            >
              Publish Story
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default TravelPostForm;