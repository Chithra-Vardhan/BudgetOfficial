import Axios from "axios";
import React, { useState } from "react";
import './style.css';
// import validator from "validator";
import { ToastContainer, toast } from 'react-toastify';

import validator from 'validator';
import { useNavigate } from "react-router-dom";


import 'react-toastify/dist/ReactToastify.css';



function Nform() {

    const navigate = useNavigate()
    const showToastMessage = () => {

        toast.success('Submitted Successful !', {
            position: toast.POSITION.TOP_RIGHT
        });
        // alert("submitted succesful");
    
    }

    const logIn = () => {
        navigate('/login');
    }

    const url = "http://localhost:5000/signup";
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState('')
    const validateEmail = (e) => {
        var email = e.target.value
        if (validator.isEmail(email)) {
            setEmailError('')
        } else {
            setEmailError('Enter valid Email!')
        }

    }

    const [errorMessage, setErrorMessage] = useState('')
    const validate = (value) => {
        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setErrorMessage('')
        } else {
            setErrorMessage('Use strong password')
        }
    }

    function handleSubmit(e) {
        

        if ((name !== '') && (email !== '') && (password !== '')) {
            Axios.post(url, {
                name,
                email,
                password
            })
            .then((res) => { 
               
            });
            showToastMessage();
        }
        e.preventDefault()
        clearInput();
    };

    const clearInput = () => {
        setName("");
        setEmail("");
        setPassword("");
    };
    


    return (

        <div className="d-flex justify-content-center m-5">
            <div className="mainContainer">
                <div className="form-container">
                    <h1>Sign Up </h1>
                    <hr></hr>
                    <br></br>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <label><b>Name :</b></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="name" type="text" required></input>
                
                        <label><b>Email address :</b></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input onChange={(e) => { setEmail(e.target.value); validateEmail(e) }} value={email} placeholder="email" type="text" required></input>

                        <span style={{ fontWeight: 'bold', color: 'red', }}>{emailError}</span> <br></br>
                        <label><b>Password : </b></label>
                        <input onChange={(e) => { setPassword(e.target.value); validate(e.target.value) }} value={password} placeholder="password" type="password" required></input>

                        <br /><br />
                        {errorMessage === '' ? null : <span style={{ fontWeight: 'bold', color: 'red', }}>{errorMessage}</span>} <br></br>
                        <button type="submit"  className="btn btn-danger">Sign Up</button>
                        <span style={{ fontWeight: 'bold', color: 'blue', }}>Already a User?</span>
                        <button type="button" onClick={logIn} className ="btn btn-primary">Log in</button>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default Nform;