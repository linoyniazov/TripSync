import { ChangeEvent, useRef, useState } from "react";
import { Form, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { uploadImage } from "../../services/file-service";
import { registerUser, loginUser, googleSignin, IUser } from "../../services/user-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";

function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [profileImage, setProfileImage] = useState<File>();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const selectImage = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (isLoginForm) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handleRegister = async () => {
    const url = await uploadImage(profileImage!);
    const user: IUser = {
      username: usernameInputRef.current ? usernameInputRef.current.value : "",
      email: emailInputRef.current ? emailInputRef.current.value : "",
      password: passwordInputRef.current ? passwordInputRef.current.value : "",
      profileImage: url,
    };

    try {
      const res = await registerUser(user);
      if (res.accessToken) {
        navigate("/home");
      }
    } catch (error) {
      console.log("Error registering user:", error);
    }
  };

  const handleLogin = async () => {
    const user: IUser = {
      email: emailInputRef.current ? emailInputRef.current.value : "",
      password: passwordInputRef.current ? passwordInputRef.current.value : "",
    };

    try {
      const res = await loginUser(user);
      if (res.accessToken) {
        navigate("/home");
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await googleSignin({ credential: credentialResponse.credential });
      if (res.accessToken) {
        navigate("/home");
      }
    } catch (error) {
      console.log("Google Sign-In error:", error);
    }
  };
  
  const onGoogleLoginFailure = () => {
    console.log("Google login failure");
  };

  return (
    <div className="auth-form-container">
      <div className="image-container">
        <img src={isLoginForm ? "/login2.jpg" : "/signUp2.jpg"} alt={isLoginForm ? "Login" : "Sign Up"} />
      </div>
      <div className="form-container">
        <div className="header-container">
          <h4 className="_firstHeader">
            {isLoginForm ? "Welcome Back!" : "Hi, Get Started Now"}
          </h4>
          <p className="_secondHeader">
            {isLoginForm ? "Enter your login details" : "Enter details to create your TripSync account"}
          </p>
        </div>

        <Form>
          {!isLoginForm && (
            <div className="form-control-container text-center">
              <div className="position-relative d-inline-block">
                <Image
                  src={profileImage ? URL.createObjectURL(profileImage) : "/avatar.jpeg"}
                  style={{ 
                    height: "150px", 
                    width: "150px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "3px solid var(--primary-color)"
                  }}
                />
                <Button
                  variant="link"
                  className="position-absolute bottom-0 end-0 p-2"
                  onClick={selectImage}
                  style={{ 
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <FontAwesomeIcon icon={faImage} className="text-white" />
                </Button>
              </div>
              <Form.Control
                ref={fileInputRef}
                type="file"
                className="d-none"
                onChange={imgSelected}
              />
            </div>
          )}

          {!isLoginForm && (
            <Form.Group className="form-control-container">
              <Form.Label>Username</Form.Label>
              <Form.Control
                ref={usernameInputRef}
                type="text"
                placeholder="Enter your username"
                className="rounded-lg"
              />
            </Form.Group>
          )}

          <Form.Group className="form-control-container">
            <Form.Label>Email</Form.Label>
            <Form.Control
              ref={emailInputRef}
              type="email"
              placeholder="Enter your email"
              className="rounded-lg"
            />
          </Form.Group>

          <Form.Group className="form-control-container">
            <Form.Label>Password</Form.Label>
            <Form.Control
              ref={passwordInputRef}
              type="password"
              placeholder="Enter your password"
              className="rounded-lg"
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleSubmit}
            className="w-100 rounded-lg mb-3"
            style={{
              backgroundColor: "var(--primary-color)",
              borderColor: "var(--primary-color)"
            }}
          >
            {isLoginForm ? "Log In" : "Sign Up"}
          </Button>

          <div className="text-center mb-3">
            {isLoginForm ? (
              <>
                Don't have an account yet?{" "}
                <Link 
                  to="#" 
                  onClick={() => setIsLoginForm(false)}
                  style={{ color: "var(--primary-color)" }}
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link 
                  to="#" 
                  onClick={() => setIsLoginForm(true)}
                  style={{ color: "var(--primary-color)" }}
                >
                  Log in to account
                </Link>
              </>
            )}
          </div>

          <div className="d-flex justify-content-center">
            <GoogleLogin 
              onSuccess={onGoogleLoginSuccess} 
              onError={onGoogleLoginFailure}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AuthForm;