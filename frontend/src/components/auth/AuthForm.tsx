import { ChangeEvent, useRef, useState } from "react";
import avatar from "../../assets/avatar.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { uploadImage } from "../../services/file-service";
import { registerUser, loginUser, googleSignin, IUser } from "../../services/user-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";

function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState(true); // מצב: התחברות או הרשמה
  const [profileImage, setProfileImage] = useState<File>();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      username: usernameInputRef.current?.value!,
      email: emailInputRef.current?.value!,
      password: passwordInputRef.current?.value!,
      profileImage: url,
    };

    try {
      const res = await registerUser(user);
      console.log(res);
      if (res.accessToken) {
        window.location.href = "/home";
      }
    } catch (error) {
      console.log("Error registering user:", error);
    }
  };

  const handleLogin = async () => {
    const user: IUser = {
      email: emailInputRef.current?.value!,
      password: passwordInputRef.current?.value!,
    };

    try {
      const res = await loginUser(user);
      console.log(res);
      if (res.accessToken) {
        window.location.href = "/home";
      }
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("🔹 Google Sign-in Response:", credentialResponse);
    try {
      const res = await googleSignin(credentialResponse);
      console.log("🔹 Server Response:", res);  // 🚀 כאן תראי מה השרת מחזיר

      if (res.accessToken) {
        console.log("✅ Login successful! Redirecting...");
        window.location.href = "/home"; // המעבר קורה רק אחרי שבדקנו את התגובה
      }
    } catch (error) {
      console.log("❌ Error:", error);
    }
};

  const onGoogleLoginFailure = () => {
    console.log("Google login failure");
  };

  return (
    <div className="vstack gap-3 col-md-7 mx-auto">
      <h1>{isLoginForm ? "Login" : "Register"}</h1>

      {!isLoginForm && (
        <div className="d-flex flex-column align-items-center position-relative">
          <img
            src={profileImage ? URL.createObjectURL(profileImage) : avatar}
            style={{ height: "230px", width: "230px" }}
            className="img-fluid"
          />
          <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImage}>
            <FontAwesomeIcon icon={faImage} className="fa-xl" />
          </button>
        </div>
      )}

      {!isLoginForm && (
        <input
          style={{ display: "none" }}
          ref={fileInputRef}
          type="file"
          onChange={imgSelected}
        ></input>
      )}

      {!isLoginForm && (
        <div className="form-floating">
          <input ref={usernameInputRef} type="text" className="form-control" id="floatingUsername" placeholder="" />
          <label htmlFor="floatingUsername">Username</label>
        </div>
      )}

      <div className="form-floating">
        <input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder="" />
        <label htmlFor="floatingInput">Email</label>
      </div>
      <div className="form-floating">
        <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="" />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        {isLoginForm ? "Log In" : "Register"}
      </button>

    <div className="text-center">
        {isLoginForm ? (
            <>
                Don't have an account? <Link to="#" onClick={() => setIsLoginForm(false)}>Sign up</Link>
            </>
        ) : (
            <>
                Already have an account? <Link to="#" onClick={() => setIsLoginForm(true)}>Log in</Link>
            </>
        )}
    </div>

      <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
    </div>
  );
}

export default AuthForm;
