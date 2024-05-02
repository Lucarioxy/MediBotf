import React, { useState, useContext } from 'react';
import OptionsList from './OptionsList';
import '../style.css'

import { chatPageContext } from '../ChatPage'

function TitleAndLogo () {
    const chatPage = useContext(chatPageContext)
    const [contextMenuOpen, setContextMenuOpen] = chatPage['contextMenuOpen']
    
    const handleContextMenuToggle = () => {
        const newContextMenuOpen = !contextMenuOpen;
        setContextMenuOpen(newContextMenuOpen);
    };
    
    return (
        <section className="title-and-logo flex-between-center">
            <div className="title flex-between-center">
                <img className="title-logo" src="logo-primary.svg" alt="LOGO" />
                <strong className="title-txt">CHAT</strong>
            </div>
            <div className="user-logo flex-center-center">
                <input type="checkbox" name="context-menu" id="context-menu" onChange={handleContextMenuToggle} checked={contextMenuOpen} />
                <label htmlFor="context-menu"><img id="user-logo" src="user-primary.svg" alt="USER" /></label>
                {contextMenuOpen && (<OptionsList />)}
            </div>
        </section>
    )
}

export default TitleAndLogo