import React, { useState, useRef, useEffect, useContext } from "react";
import '../style.css';
import { chatPageContext } from "../ChatPage";
import { userContext } from "../../App";
import ReactMarkdown from 'react-markdown';

function ChatHistory() {
    const chatPage = useContext(chatPageContext)
    const user = useContext(userContext)
    const [chatHistory, setChatHistory] = user['chat-history']
    const [chatLoading, setChatLoading] = user['chat-loading']
    
    const endListRef = useRef(null)
    
    const scrollToBottom = () => {
        endListRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }
    
    useEffect(() => {
        scrollToBottom()
    }, [chatHistory])
    
    return (
        <section className="flex-col chat-history">
            {
                chatHistory.map((chat) => {
                    return (
                        <div className={`chat-message ${chat['role'] === 'assistant' ? 'assistant-chat' : 'user-chat' }`}>
                            <ReactMarkdown >{chat['content']}</ReactMarkdown>
                        </div>
                    )
                })
            }
            {
                chatLoading &&
                <div className='chat-message assistant-chat'>
                    <p style={{opacity: '0.6'}}>Loading...</p>
                </div>
            }
            <div ref={ endListRef }/>
        </section>
    )
}

export default ChatHistory