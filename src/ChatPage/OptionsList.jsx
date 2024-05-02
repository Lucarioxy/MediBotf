import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import StartRecording from "./Options/StartRecording";
import UploadDocuments from "./Options/UploadDocuments";
import '../style.css'

function OptionsList () {
    return (
        <div className="options-list">
            <ul className="flex-col">
                <li className="option"><Link to="/profile"><strong>Profile</strong></Link></li>
                <li className="option"><StartRecording /></li>
                <li className="option"><UploadDocuments /></li>
            </ul>
        </div>
    )
}

export default OptionsList