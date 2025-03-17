import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiClient from "../services/axiosInstance";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("accessToken"));
  }, [location.pathname]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await apiClient.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    // ניקוי הנתונים מה-localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");

    // עדכון הסטטוס כדי לגרום לניווט אוטומטי
    setIsAuthenticated(false);

    navigate("/"); // חזרה לעמוד התחברות
  };

  return (
    <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="gradient-text">
          TripSync
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto" style={{ maxWidth: "500px" }}>
            <FormControl
              type="search"
              placeholder="Search destinations, travelers, or stories..."
              className="me-2 rounded-pill"
              aria-label="Search"
            />
          </Form>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              My Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/travel-ai">
              Travel AI
            </Nav.Link>

            {isAuthenticated ? (
              <Nav.Link
                as="button"
                onClick={handleLogout}
                className="btn btn-outline-danger ms-3"
              >
                Log Out
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/auth" className="btn btn-primary ms-3">
                Log In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
