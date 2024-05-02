import React, { useState, useEffect, useRef, useContext } from 'react';
import '../style.css'

import { chatPageContext } from '../ChatPage'
import { userContext } from '../../App';

function ChatTextarea () {
    
    const chatPage = useContext(chatPageContext)
    const user = useContext(userContext)
    const [isTextareaEmpty, setIsTexareaEmpty] = chatPage['isTextareaEmpty']
    const [inputText, setInputText] = chatPage['inputText'];
    const [chatHistory, setChatHistory] = user['chat-history']
    const [chatLoading, setChatLoading] = user['chat-loading']
    
    
    const textareaRef = useRef(null);

    useEffect(() => {
        if (chatHistory.length > 0 && chatHistory.length % 2) {
            getResponseAndAppend(chatHistory[chatHistory.length - 1].content)
        }
    }, [chatHistory])
    
    const getResponseAndAppend = (query) => {
        const userData = JSON.parse(localStorage.getItem('user-data'))
        setChatLoading(true)
        try {
            fetch('http://localhost:8000/chats/getAssistantResponse', {
                "method": 'POST',
                "headers": {"Content-Type": "application/JSON"},
                "body": JSON.stringify({
                    'history': chatHistory,
                    'user_id': userData['user_id'],
                    'prompt': "Assume you are a MEDICAL EXPERT with knowledge and experience to solve HEALTH/MEDICAL related queries based on a patient's information.\nYOU CAN\'T THINK THAT YOU AREN\'T A MEDICAL EXPERT.\nMAKE SURE THE TEXT IS BEAUTIFULLY FORMATTED IN MARKDOWN FORMAT, BUT DON\'T USE ANY TABLES, I REPEAT NO TABLES.\nUse the information to answer the user's question with the context you have.\nIf you don't know the answer, just say that you don't know, don't try to make up an answer.\nOnly return the helpful answer and nothing else."
                })
            }).then(response => {
                if (!response.ok) {
                    throw Error('Can\'t Process the Promise')
                }
                return response.json()
            }).then(data => {
                setChatHistory(prevChatHistory => [
                    ...prevChatHistory,
                    {
                        'role': 'assistant',
                        'content': data.content
                    }
                ])
            }).finally(() => {
                setChatLoading(false)
            })
        } catch (e) {
            console.error('Chat Fetch Error: ' + e)
            setChatLoading(false)
        }
    }

    useEffect(() => {
        setIsTexareaEmpty(inputText === '')
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [inputText]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() !== '') {
            const queryText = inputText.trim();
            setChatHistory(prevChatHistory => [
                ...prevChatHistory,
                {
                    'role': 'user',
                    'content': queryText
                }
            ])
            setInputText('')
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13 && e.shiftKey) {
            e.preventDefault();
            if (inputText.trim() !== '') {
                const queryText = inputText.trim()
                setChatHistory(prevChatHistory => [
                    ...prevChatHistory,
                    {
                        'role': 'user',
                        'content': queryText
                    }
                ])
                setInputText('')
            }
        }
    }
    
    return (
        <form className="chat-textarea query-form flex-between">
            <textarea
                ref={textareaRef}
                className="input-textarea"
                name="user-input"
                id="user-input-area"
                cols="35"
                rows="1"
                placeholder="Ask me a Question..."
                autoFocus
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            ></textarea>
            <div className="send-logo-wrapper">
                <button className="submit-button no-display" onClick={handleSubmit}>
                    <img src="send-primary.svg" alt="SEND" />
                </button>
            </div>
        </form>
    )
}

export default ChatTextarea;
