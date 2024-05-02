import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ChatPage } from "./src/ChatPage";
import { ProfilePage } from "./src/ProfilePage";
import { LoginPage } from "./src/LoginPage";

const userContext = createContext()

function App() {
    const [userData, setUserData] = useState({})
    const [chatHistory, setChatHistory] = useState([])
    const [chatLoading, setChatLoading] = useState(false)
    const user = {
        'user-data': [userData, setUserData],
        'chat-history': [chatHistory, setChatHistory],
        'chat-loading': [chatLoading, setChatLoading]
    }
    return (
        <userContext.Provider value={ user }>
            <Router>
                <Routes>
                    <Route path="/" exact element={<LoginPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/profile" element={<ProfilePage />}/>
                </Routes>
            </Router>
        </userContext.Provider>
    )
}

export { App, userContext };
