import React, { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

import TitleAndLogo from './ChatPage/TitleAndLogo';
import ChatHistory from './ChatPage/ChatHistory';
import ChatTextarea from './ChatPage/ChatTextarea';
import RecordingText from './Components/RecordingText';

const chatPageContext = createContext()

const ChatPage = () => {
    const userData = JSON.parse(localStorage.getItem('user-data'))
    const navigate = useNavigate()
    
    const [contextMenuOpen, setContextMenuOpen] = useState(false)
    const [isTextareaEmpty, setIsTexareaEmpty] = useState(true)
    const [inputText, setInputText] = useState('')
    const [recordingModeOn, setRecordingModeOn] = useState(false)
    
    const chatPage = {
        'contextMenuOpen': [contextMenuOpen, setContextMenuOpen],
        'isTextareaEmpty': [isTextareaEmpty, setIsTexareaEmpty],
        'inputText': [inputText, setInputText],
        'recordingModeOn': [recordingModeOn, setRecordingModeOn]
    }
    
    
    useEffect(() => {
        if (!userData)
            navigate('/')
    }, [])
    
    const handleBlurOverlayClick = () => {
        setContextMenuOpen(false)
    }

    return (
        <chatPageContext.Provider value = { chatPage }>
            <main className="chat-page page flex-col">
                {contextMenuOpen && <div className="blur-overlay" onClick={handleBlurOverlayClick}></div>}
                {recordingModeOn && <RecordingText />}
                <TitleAndLogo />
                <ChatHistory />
                <ChatTextarea />
            </main>
        </chatPageContext.Provider>
    )
}

export { ChatPage, chatPageContext }
