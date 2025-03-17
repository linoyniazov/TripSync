import { ChangeEvent, useRef, useState } from "react";
import avatar from "../assets/avatar.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { uploadImage } from "../services/file-service";
import { registerUser, googleSignin, IUser } from "../services/user-service";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'


function Registration() {
  const [profileImage, setProfileImage] = useState<File>();
  const usernameInputRef = useRef<HTMLInputElement>(null); // Add this line
  const emailInputeRef = useRef<HTMLInputElement>(null);
  const passwordInputeRef = useRef<HTMLInputElement>(null);
  const fileInputeRef = useRef<HTMLInputElement>(null);
  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };
  const selectImage = () => {
    console.log("Selecting image...");
    fileInputeRef.current?.click();
  };
  

  const register = async () => {
    // console.log("Registering...");
    // console.log("Username:", usernameInputRef.current?.value); // Add this line
    // console.log("Email:", emailInputeRef.current?.value);
    // console.log("Password:", passwordInputeRef.current?.value);
    const url = await uploadImage(profileImage!);
    console.log("Profile Image URL:", url);
    const user: IUser = {
      username: usernameInputRef.current?.value!,
      email: emailInputeRef.current?.value!,
      password: passwordInputeRef.current?.value!,
      profileImage: url,
    };

    const res= await registerUser(user);
    console.log(res);
  };

  const onGoogleLoginSuccess=async (credentialResponse: CredentialResponse) => {
    // Add Google login logic here
    console.log(credentialResponse);
    try {
    const res= await googleSignin(credentialResponse);
    console.log(res);
    } catch (error) {
    console.log(error);
    }
  }

  const onGoogleLoginFailure= () => {
    // Add Google login failure logic here
    console.log("Google login failure");
  };

  return (
    <div className="vstack gap-3 col-md-7 mx-auto">
      <h1>Register</h1>
      <div className="d-flex flex-column align-items-center position-relative">
        <img
          src={profileImage ? URL.createObjectURL(profileImage) : avatar}
          style={{ height: "230px", width: "230px" }}
          className="img-fluid"
        />
        <button
          type="button"
          className="btn position-absolute bottom-0 end-0"
          onClick={selectImage}
        >
          <FontAwesomeIcon icon={faImage} className="fa-xl" />
        </button>
      </div>

      <input
        style={{ display: "none" }}
        ref={fileInputeRef}
        type="file"
        onChange={imgSelected}
      ></input>
      <div className="form-floating">
        <input
          ref={usernameInputRef} // Add this line
          type="text"
          className="form-control"
          id="floatingUsername"
          placeholder=""
        />
        <label htmlFor="floatingUsername">Username</label> {/* Add this line */}
      </div>
      <div className="form-floating">
        <input
          ref={emailInputeRef}
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder=""
        />
        <label htmlFor="floatingInput">Email</label>
      </div>
      <div className="form-floating">
        <input
          ref={passwordInputeRef}
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder=""
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>
      <button type="button" className="btn btn-primary" onClick={register}>
        Register
      </button>
      <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
    </div>);
}

export default Registration;
