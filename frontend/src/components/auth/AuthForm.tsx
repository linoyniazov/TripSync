import { ChangeEvent, useRef, useState } from "react";
import { Form, Button, Image, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { uploadImage } from "../../services/file-service";
import { registerUser, loginUser, googleSignin, IUser } from "../../services/user-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomAlert from "../CustomAlert";
import { loginSchema, registerSchema, type FormData } from "./validation";
import "./AuthForm.css";

function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [profileImage, setProfileImage] = useState<File>();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(isLoginForm ? loginSchema : registerSchema)
  });

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const selectImage = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage("");
      
      if (isLoginForm) {
        const res = await loginUser(data);
        if (res.accessToken) {
          navigate("/home");
        }
      } else {
        if (!data.username) {
          setErrorMessage("Username is required");
          return;
        }
        
        const url = profileImage ? await uploadImage(profileImage) : "";
        
        const userData: IUser = {
          ...data,
          profileImage: url,
        };
        
        const res = await registerUser(userData);
        if (res.accessToken) {
          navigate("/home");
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setErrorMessage(error.message || "An error occurred. Please try again.");
    }
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setErrorMessage("");
    reset();
    setProfileImage(undefined);
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setErrorMessage("");
      const res = await googleSignin(credentialResponse);
      if (res.accessToken) {
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      setErrorMessage(error.message || "Google sign-in failed. Please try again.");
    }
  };
  
  const onGoogleLoginFailure = () => {
    setErrorMessage("Google sign-in failed. Please try again.");
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

        {errorMessage && (
          <CustomAlert type="danger" message={errorMessage} margin="0 0 1rem 0" />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("username")}
                type="text"
                placeholder="Enter your username"
                className="rounded-lg"
                isInvalid={!!errors.username}
              />
              {errors.username && (
                <Form.Control.Feedback type="invalid">
                  {errors.username.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          )}

          <Form.Group className="form-control-container">
            <Form.Label>Email</Form.Label>
            <Form.Control
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="rounded-lg"
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="form-control-container">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="rounded-lg"
                isInvalid={!!errors.password}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                className="border-0"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </Button>
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
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
                  onClick={toggleForm}
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
                  onClick={toggleForm}
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

// import { ChangeEvent, useRef, useState } from "react";
// import { Form, Button, Image, InputGroup } from 'react-bootstrap';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faImage, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import { uploadImage } from "../../services/file-service";
// import { registerUser, loginUser, googleSignin, IUser } from "../../services/user-service";
// import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
// import { Link, useNavigate } from "react-router-dom";
// import CustomAlert from "../CustomAlert";
// import { loginSchema, registerSchema } from "./validation";

// import "./AuthForm.css";

// function AuthForm() {
//   const [isLoginForm, setIsLoginForm] = useState(true);
//   const [profileImage, setProfileImage] = useState<File>();
//   const [showPassword, setShowPassword] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const usernameInputRef = useRef<HTMLInputElement>(null);
//   const emailInputRef = useRef<HTMLInputElement>(null);
//   const passwordInputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setProfileImage(e.target.files[0]);
//     }
//   };

//   const selectImage = () => {
//     fileInputRef.current?.click();
//   };

//   const validateForm = (isLogin: boolean) => {
//     const email = emailInputRef.current?.value || '';
//     const password = passwordInputRef.current?.value || '';
//     const username = usernameInputRef.current?.value;

//     try {
//       if (isLogin) {
//         loginSchema.parse({ email, password });
//       } else {
//         registerSchema.parse({ email, password, username });
//       }
//       return true;
//     } catch (error: any) {
//       setErrorMessage(error.errors?.[0]?.message || "Validation failed");
//       return false;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");
    
//     if (!validateForm(isLoginForm)) {
//       return;
//     }

//     if (isLoginForm) {
//       await handleLogin();
//     } else {
//       await handleRegister();
//     }
//   };

//   const handleRegister = async () => {
//     const username = usernameInputRef.current?.value || '';
//     const email = emailInputRef.current?.value || '';
//     const password = passwordInputRef.current?.value || '';

//     try {
//       const url = profileImage ? await uploadImage(profileImage) : "";
//       const userData: IUser = {
//         username,
//         email,
//         password,
//         profileImage: url,
//       };
      
//       const res = await registerUser(userData);
//       if (res.accessToken) {
//         navigate("/home");
//       }
//     } catch (error: any) {
//       console.error("Error registering user:", error);
//       setErrorMessage(error.message || "Registration failed. Please try again.");
//     }
//   };

//   const handleLogin = async () => {
//     const userData: IUser = {
//       email: emailInputRef.current?.value || '',
//       password: passwordInputRef.current?.value || '',
//     };

//     try {
//       const res = await loginUser(userData);
//       if (res.accessToken) {
//         navigate("/home");
//       }
//     } catch (error: any) {
//       console.error("Error logging in:", error);
//       setErrorMessage(error.message || "Invalid email or password");
//     }
//   };

//   const toggleForm = () => {
//     setIsLoginForm(!isLoginForm);
//     setErrorMessage("");
//     if (usernameInputRef.current) usernameInputRef.current.value = "";
//     if (emailInputRef.current) emailInputRef.current.value = "";
//     if (passwordInputRef.current) passwordInputRef.current.value = "";
//     setProfileImage(undefined);
//   };

//   const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
//     try {
//       setErrorMessage("");
//       const res = await googleSignin(credentialResponse);
//       if (res.accessToken) {
//         navigate("/home");
//       }
//     } catch (error: any) {
//       console.error("Google Sign-In error:", error);
//       setErrorMessage(error.message || "Google sign-in failed. Please try again.");
//     }
//   };
  
//   const onGoogleLoginFailure = () => {
//     console.log("Google login failure");
//     setErrorMessage("Google sign-in failed. Please try again.");
//   };

//   return (
//     <div className="auth-form-container">
//       <div className="image-container">
//         <img src={isLoginForm ? "/login2.jpg" : "/signUp2.jpg"} alt={isLoginForm ? "Login" : "Sign Up"} />
//       </div>
//       <div className="form-container">
//         <div className="header-container">
//           <h4 className="_firstHeader">
//             {isLoginForm ? "Welcome Back!" : "Hi, Get Started Now"}
//           </h4>
//           <p className="_secondHeader">
//             {isLoginForm ? "Enter your login details" : "Enter details to create your TripSync account"}
//           </p>
//         </div>

//         {errorMessage && (
//           <CustomAlert type="danger" message={errorMessage} margin="0 0 1rem 0" />
//         )}

//         <Form onSubmit={handleSubmit}>
//           {!isLoginForm && (
//             <div className="form-control-container text-center">
//               <div className="position-relative d-inline-block">
//                 <Image
//                   src={profileImage ? URL.createObjectURL(profileImage) : "/avatar.jpeg"}
//                   style={{ 
//                     height: "150px", 
//                     width: "150px",
//                     objectFit: "cover",
//                     borderRadius: "50%",
//                     border: "3px solid var(--primary-color)"
//                   }}
//                 />
//                 <Button
//                   variant="link"
//                   className="position-absolute bottom-0 end-0 p-2"
//                   onClick={selectImage}
//                   style={{ 
//                     backgroundColor: "var(--primary-color)",
//                     borderRadius: "50%",
//                     width: "40px",
//                     height: "40px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center"
//                   }}
//                 >
//                   <FontAwesomeIcon icon={faImage} className="text-white" />
//                 </Button>
//               </div>
//               <Form.Control
//                 ref={fileInputRef}
//                 type="file"
//                 className="d-none"
//                 onChange={imgSelected}
//               />
//             </div>
//           )}

//           {!isLoginForm && (
//             <Form.Group className="form-control-container">
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 ref={usernameInputRef}
//                 type="text"
//                 placeholder="Enter your username"
//                 className="rounded-lg"
//                 required
//                 minLength={3}
//               />
//             </Form.Group>
//           )}

//           <Form.Group className="form-control-container">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               ref={emailInputRef}
//               type="email"
//               placeholder="Enter your email"
//               className="rounded-lg"
//               required
//             />
//           </Form.Group>

//           <Form.Group className="form-control-container">
//             <Form.Label>Password</Form.Label>
//             <InputGroup>
//               <Form.Control
//                 ref={passwordInputRef}
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 className="rounded-lg"
//                 required
//                 minLength={8}
//               />
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="border-0"
//               >
//                 <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//               </Button>
//             </InputGroup>
//           </Form.Group>

//           <Button
//             variant="primary"
//             type="submit"
//             className="w-100 rounded-lg mb-3"
//             style={{
//               backgroundColor: "var(--primary-color)",
//               borderColor: "var(--primary-color)"
//             }}
//           >
//             {isLoginForm ? "Log In" : "Sign Up"}
//           </Button>

//           <div className="text-center mb-3">
//             {isLoginForm ? (
//               <>
//                 Don't have an account yet?{" "}
//                 <Link 
//                   to="#" 
//                   onClick={toggleForm}
//                   style={{ color: "var(--primary-color)" }}
//                 >
//                   Create an account
//                 </Link>
//               </>
//             ) : (
//               <>
//                 Already have an account?{" "}
//                 <Link 
//                   to="#" 
//                   onClick={toggleForm}
//                   style={{ color: "var(--primary-color)" }}
//                 >
//                   Log in to account
//                 </Link>
//               </>
//             )}
//           </div>

//           <div className="d-flex justify-content-center">
//             <GoogleLogin 
//               onSuccess={onGoogleLoginSuccess} 
//               onError={onGoogleLoginFailure}
//             />
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default AuthForm;


