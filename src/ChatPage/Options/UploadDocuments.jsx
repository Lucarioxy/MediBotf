import React, {useState, useEffect} from "react";
import './style.css';

function UploadDocuments() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploaded, setUploaded] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [state, setState] = useState('Upload Documents')
    const user_id = JSON.parse(localStorage.getItem('user-data'))['user_id']

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData()
            formData.append("file", selectedFile)
            formData.append("user_id", user_id)
            
            setUploading(true)
            setState("Uploading")
            
            fetch("http://localhost:8000/files/upload_pdf", {
                "method": "POST",
                "body": formData
            })
            .then(response => {
                setUploading(true)
                if (response.ok) {
                    setState("Upload Documents")
                    setUploaded(true)
                    setInterval(() => {
                        setUploaded(false)
                    }, 2000)
                } else {
                    setState("Couldn\'t Upload")
                    setInterval(() => {
                        setState('Upload Documents')
                    }, 2000)
                }
            })
            .catch(error => {
                console.error('Couldn\'t upload the file: ' + error)
            })
        }
    };

    return (
        <main className="upload-documents">
            <div className="upload-wrapper flex-col-center">
                <input type="file" name="upload-document" id="upload-document" accept=".pdf" onChange={handleFileChange} />
                <label htmlFor="upload-document"><strong>{ selectedFile ? selectedFile.name : uploaded ? "✅" : "+" }</strong></label>
                <button className="no-display" onClick={handleUpload}><strong>{uploading ? state : "Upload Documents"}</strong> </button>
            </div>
        </main>
    )
}

export default UploadDocuments