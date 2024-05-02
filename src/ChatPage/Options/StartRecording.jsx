import React, {useState, useEffect, useContext} from "react";
import './style.css';
import '../../style.css';

import { chatPageContext } from '../../ChatPage'

function StartRecording() {
    const chatPage = useContext(chatPageContext)
    const [isTextareaEmpty, setIsTexareaEmpty] = chatPage['isTextareaEmpty']
    const [contextMenuOpen, setContextMenuOpen] = chatPage['contextMenuOpen']
    const [recordingModeOn, setRecordingModeOn] = chatPage['recordingModeOn']
    
    const handleClick = () => {
        if (isTextareaEmpty) {
            setContextMenuOpen(false)
            setRecordingModeOn(true)
        } else {
            alert('Clear the query first!')
        }
    }
    
    return (
        <main className="start-recording">
            <button className="no-display" onClick={handleClick}><strong>Start Recording</strong></button>
        </main>
    )
}

export default StartRecording
