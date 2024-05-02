import React, { useState, useEffect, useContext, useRef } from "react";
import '../style.css'
import './style.css'
import { chatPageContext } from "../ChatPage";
import axios from 'axios'
import MicRecorder from 'mic-recorder-to-mp3'
import { useNavigate } from 'react-router-dom'

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "3126e1f7b00f43769b6a0d7d500d681f",
        "content-type": "application/json",
    },
})

function RecordingText() {
    const navigate = useNavigate()
    
    const chatPage = useContext(chatPageContext)
    const [recordingModeOn, setRecordingModeOn] = chatPage['recordingModeOn']
    const [timer, setTimer] = useState({ minutes: 0, seconds: 0 })
    const [isRunning, setIsRunning] = useState(false)
    const [hideButtons, setHideButtons] = useState(false)
    const [uploading, setUploading] = useState(false)

    const recorder = useRef(null) //Recorder
    // const [blobURL, setBlobUrl] = useState(null)
    const [audioFile, setAudioFile] = useState(null)

    useEffect(() => {
        //Declares the recorder object and stores it inside of ref
        recorder.current = new MicRecorder({ bitRate: 128 })
    }, [])


    useEffect(() => {
        let interval
        if (isRunning) {
            interval = setInterval(() => {
                setTimer(prevTimer => {
                    const seconds = prevTimer.seconds + 1
                    const minutes = Math.floor(seconds / 60)
                    return {
                        minutes: minutes,
                        seconds: seconds % 60
                    }
                })
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isRunning])

    const handleStartButton = () => {
        recorder.current.start().then(() => {
            setIsRunning(true);
        })
    }

    const handleStopButton = () => {
        recorder.current.stop().getMp3().then(([buffer, blob]) => {
            const file = new File(buffer, 'audio.mp3', {
                type: blob.type,
                lastModified: Date.now(),
            })
            setIsRunning(false)
            setAudioFile(file)
        }).catch((e) => console.log(e))
        // setHideButtons(true)
    }

    // assmebly api 
    const [uploadURL, setUploadURL] = useState("")
    const [transcriptID, setTranscriptID] = useState("")
    const [transcriptData, setTranscriptData] = useState("")
    const [transcript, setTranscript] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [interval, setI] = useState(null);

    useEffect(() => {
        if (audioFile) {
            assembly
                .post("/upload", audioFile)
                .then((res) => setUploadURL(res.data.upload_url))
                .catch((err) => console.error(err))
        }
    }, [audioFile])

    useEffect(() => {
        if (uploadURL)
            submitTranscriptionHandler();
    }, [uploadURL])

    const submitTranscriptionHandler = () => {
        setIsLoading(true)
        assembly
            .post("/transcript", {
                audio_url: uploadURL,
            })
            .then((res) => {
                setTranscriptID(res.data.id)
            })
            .catch((err) => console.error(err))
    }

    // Check the status of the Transcript
    const checkStatusHandler = async () => {
        try {
            await assembly.get(`/transcript/${transcriptID}`).then((res) => {
                setTranscriptData(res.data)
            })
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {

        if (transcriptID) {
            setI(setInterval(() => {
                checkStatusHandler()
            }, 1000)
            )
        }
        return () => {
            try {
                clearInterval(interval)
            }
            catch {
                console.log("Interval was not cleared ")
            }
        }
    }, [transcriptID])

    useEffect(() => {
        if (transcriptData && transcriptData.status === "completed") {
            setIsLoading(false);
            setTranscript(transcriptData.text);
            clearInterval(interval);
            setHideButtons(true)
        }
    }, [transcriptData])

    const handleInputChange = (event) => {
        setTranscript(event.target.value);
    };
    
    const handleCloseButtonClick = (e) => {
        e.preventDefault()
        if (!isRunning && !isLoading) {
            setRecordingModeOn(false)
        }
    }
    
    const handleUploadButton = (e) => {
        e.preventDefault()
        setUploading(true)
        if (uploading) {
            try {
                const userData = JSON.parse(localStorage.getItem('user-data'))
                const body = {
                    user_id: userData.user_id,
                    context: transcript
                }
                fetch('https://medibotb.onrender.com/files/update_context', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }).then(response => {
                    if(!response.ok)
                        throw Error('Something went wrong')
                    return response.json()
                }).then(data => {
                    console.log(data)
                }).finally(() => {
                    setRecordingModeOn(false)
                    setUploading(false)
                })
            } catch (err) {
                console.error('Error: ' + err)
            }
        }
    }

    return (
        <div className="recording-overlay flex-col-center">
            <button onClick={handleCloseButtonClick} id="close-button" className='no-display'><img src="close-button.svg" alt="Go-Back" /></button>
            {!hideButtons && <strong>{
                    (!isRunning && !isLoading && !audioFile && "Start Recording")
                    || (isRunning && "Recording ...")
                    || ((isLoading || audioFile) && "Transcribing...")
                }</strong>}
            <strong>{`${timer.minutes.toString().padStart(2, '0')}min:${timer.seconds.toString().padStart(2, '0')}sec`}</strong>
            {!hideButtons && <div className="recording-buttons flex-center-center">
                {!isRunning && !isLoading && !audioFile && <button onClick={handleStartButton} className="recording-button no-display">Start</button>}
                {isRunning && !isLoading && <button onClick={handleStopButton} className="recording-button no-display">Stop</button>}
            </div>}
            {transcript !== "" 
            && <strong>Transcription:</strong>
            && <div className="transcription-wrapper flex-col">
                    <textarea className="transcription" value={transcript || ""} onChange={handleInputChange}></textarea>
                    {hideButtons && <button className="no-display" onClick={handleUploadButton}>Done✅</button>}
                </div>}
        </div>
    )
}

export default RecordingText
