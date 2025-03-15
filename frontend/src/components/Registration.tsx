import { ChangeEvent, useRef, useState } from "react";
import avatar from "../assets/avatar.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import {uploadImage} from "../services/file-service";
function Registration() {
  const [profileImage, setProfileImage] = useState<File>();
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

  // const uploadImage = (image: File) => {
  //   console.log("Uploading image..." + image);
  //   const formData = new FormData();
  //   if (image) {
  //     formData.append("file", image);
  //     apiClient
  //       .post("file?file=123.jpeg", formData, {
  //         headers: {
  //           "Content-Type": "image/jpeg",
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         // const url = res.data.url;
  //         // setProfileImage(url);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  const register = async () => {
    console.log("Registering...");
    console.log("Email:", emailInputeRef.current?.value);
    console.log("Password:", passwordInputeRef.current?.value);
    const url=await uploadImage(profileImage!);
    console.log("Profile Image URL:", url);
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
    </div>
  );
}

export default Registration;
