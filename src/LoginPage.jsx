import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

import { userContext } from "../App";

function LoginPage() {
    const user = useContext(userContext)
    const [loginToggle, setLoginToggle] = useState(true)
    const [loginData, setLoginData] = useState({ email: "", password: "" })
    const [signupData, setSignupData] = useState({ name: "", email: "", password: "", age: 0, height: 0, weight: 0, gender: "male" })
    const [userData, setUserData] = user['user-data']
    const [isLoading, setIsLoading] = useState(false)
    
    const navigate = useNavigate()
    
    useEffect(() => {
        if (localStorage.getItem('user-data') !== null) {
            navigate('/chat')
        }
    }, [])
    
    const handleLoginToggle = () => {
        if(!isLoading)
            setLoginToggle(true);
    };

    const handleSignUpToggle = () => {
        if(!isLoading)
            setLoginToggle(false);
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault()
        if(!isLoading) {
            try {
                if (parseInt(signupData.age) <= 16) {
                    alert('You must be at least 16 years old to sign up.')
                    return
                }
                if (parseInt(signupData.height) <= 0) {
                    alert('Enter Valid Height')
                    return
                }
                if (parseInt(signupData.weight) <= 0) {
                    alert('Enter Valid Weight')
                    return
                }
                const uploadData = signupData
                uploadData['age'] = parseInt(uploadData['age'])
                uploadData['height'] = parseInt(uploadData['height'])
                uploadData['weight'] = parseInt(uploadData['weight'])
                
                setIsLoading(true)
                fetch ('http://localhost:8000/users/signup', 
                {
                    "method": 'POST',
                    "headers": {"Content-Type": "application/JSON"},
                    "body": JSON.stringify(uploadData)
                }).then((response)=>{
                    console.log(response)
                    if(!response.ok)
                        throw new Error("Network response is not that OKAY.")
                    return response.json()
                }).then((data)=>{
                    console.log(data);
                    localStorage.setItem('user-data', JSON.stringify(data))
                    setUserData(data)
                    navigate('/chat')
                }).finally(() => {
                    setIsLoading(false)
                })
                
            } catch (error) {
                console.error("Error signing up:", error)
                setIsLoading(false)
            }
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!isLoading) {
            try {
                setIsLoading(true)
                fetch("http://localhost:8000/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginData)
                }).then((response)=>{
                    console.log(response)
                    if(!response.ok)
                        throw new Error("Network response is not that OKAY.")
                    return response.json()
                }).then((data)=>{
                    console.log(data);
                    localStorage.setItem('user-data', JSON.stringify(data))
                    setUserData(data)
                    navigate('/chat')
                }).finally(() => {
                    setIsLoading(false)
                })
            } catch (error) {
                console.error("Error logging in:", error)
                setIsLoading(false)
            }
        }
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target
        if (type === "login") {
            setLoginData({ ...loginData, [name]: value })
        } else {
            setSignupData({ ...signupData, [name]: value })
        }
    }

    return (
        <main className="page login-page flex-col-center">
            <strong>Welcome to the Medical Chatbot!</strong>
            <div className="form-login-signup flex-col-center">
                <div className="toggle-buttons flex-center-center">
                    <div className="toggle-button">
                        <input
                            type="radio"
                            name="authOption"
                            id="Login"
                            checked={loginToggle}
                            value={loginToggle}
                            onChange={handleLoginToggle}
                        />
                        <label htmlFor="Login">Login</label>
                    </div>
                    <div className="toggle-button">
                        <input
                            type="radio"
                            name="authOption"
                            id="SignUp"
                            checked={!loginToggle}
                            value={!loginToggle}
                            onChange={handleSignUpToggle}
                        />
                        <label htmlFor="SignUp">Sign Up</label>
                    </div>
                </div>

                {loginToggle &&
                <form className="flex-col-center" onSubmit={handleLoginSubmit}>
                    <div className="flex-col">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" id="email" onChange={(e) => handleInputChange(e, "login")} required />
                    </div>
                    <div className="flex-col">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" id="password" onChange={(e) => handleInputChange(e, "login")} required />
                    </div>
                    <button className="sign-up-submit" type="submit">Login</button>
                </form>}

                {!loginToggle &&
                <form className="flex-col-center" onSubmit={handleSignUpSubmit}>
                    <div className="flex-col">
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" id="name" onChange={(e) => handleInputChange(e, "signup")} required />
                    </div>
                    <div className="flex-col">
                        <label htmlFor="age">Age:</label>
                        <input type="number" name="age" id="age" onChange={(e) => handleInputChange(e, "signup")} required />
                    </div>
                    <div className="flex-col" style={{ width: '100%' }}>
                        <label htmlFor="gender">Gender:</label>
                        <select name="gender" id="gender" defaultValue="male" onChange={(e) => handleInputChange(e, "signup")} required>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="undisclosed">Undisclosed</option>
                        </select>
                    </div>
                    <div className="flex-col">
                        <label htmlFor="height">Height (cm):</label>
                        <input type="number" name="height" id="height" onChange={(e) => handleInputChange(e, "signup")} required />
                    </div>
                    <div className="flex-col">
                        <label htmlFor="weight">Weight (kg):</label>
                        <input type="number" name="weight" id="weight" onChange={(e) => handleInputChange(e, "signup")} required />
                    </div>
                    <div className="flex-col">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" id="email" onChange={(e) => handleInputChange(e, "signup")} required />
                    </div>
                    <div className="flex-col">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" id="password" onChange={(e) => handleInputChange(e, "signup")} required />
                    </div>
                    <button className="sign-up-submit" type="submit">{ isLoading ? "Signing Up ..." : "Sign Up" }</button>
                </form>}

            </div>
        </main>
    );
}

export { LoginPage };
