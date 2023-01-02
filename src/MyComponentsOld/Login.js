import Axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import validator from "validator";

import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const url = "http://localhost:5000/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");

  // validating email
  const validateEmail = (e) => {
    var email = e.target.value;
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter valid Email!");
    }
  };

  //showtoast message two
  const showToastMessage1 = () => {
    toast.success("Login failed !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  //showtoast message one
  const showToastMessage = () => {
    toast.success("Login Successfull !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const logIn = () => {
    navigate("/signup");
  };

  ///handelsubmit1
  function handleSubmit1(e) {
    e.preventDefault();
    Axios.post(url, {
      email,
      password,
    }).then((res) => {
      function toastMessage() {
        if (res.data.sucess == "True") {
          showToastMessage();
          navigate("/home");
        } else if (res.data.sucess == "False") {
          showToastMessage1();
        }
      }
      toastMessage();
    });
    localStorage.setItem("email", email);
    clearInput();
  }
  //clearInput
  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="d-flex justify-content-center m-5">
        <div className="mainContainer">
          <div className="form-container">
            <h1>Login </h1>
            <hr></hr>

            <form onSubmit={(e) => handleSubmit1(e)}>
              <label>
                <b>Email :</b>
              </label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e);
                }}
                value={email}
                placeholder="Enter Email"
                type="text"
                required
              ></input>
              <br></br>
              <span style={{ fontWeight: "bold", color: "red" }}>
                {emailError}
              </span>{" "}
              <br></br>
              <label>
                <b>Password :</b>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter Password"
                type="password"
                required
              ></input>
              <br></br>
              <br></br>
              <button type="submit" className="btn btn-primary">
                Login{" "}
              </button>{" "}
              <span style={{ fontWeight: "bold", color: "red" }}>
                {" "}
                Not a user ?
              </span>
              <button type="button" onClick={logIn} className="btn btn-danger">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
