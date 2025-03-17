function Login() {
    return (
      <div className="vstack gap-3 col-md-7 mx-auto">
        <h1>Login</h1>
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingInput" placeholder="Email" />
          <label htmlFor="floatingInput">Email</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button type="button" className="btn btn-primary">Log in</button>
      </div>
    );
  }
  
  export default Login;
  