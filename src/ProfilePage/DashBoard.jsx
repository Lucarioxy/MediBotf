import React, {useContext, useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import './style.css'
import '../style.css'


function DashBoard () {
    const userData = JSON.parse(localStorage.getItem('user-data'))
    const [userSummary, setUserSummary] = useState('Loading...')
    const gender = {
        'male': 'Male',
        'female': 'Female',
        'non-binary': 'Non-binary',
        'undisclosed': 'Undisclosed'
    }

    useEffect(() => {
        try {
            fetch('https://medibotb.onrender.com/chats/getAssistantResponse', {
                "method": 'POST',
                "headers": {"Content-Type": "application/JSON"},
                "body": JSON.stringify({
                    'history': [],
                    'user_id': userData['user_id'],
                    'prompt': "You are a SUMMARIZER. YOU SHALL ONLY WRITE IN MARKDOWN, BUT NOT USE TABLES, I REPEAT NO TABLES. Your objective is to summarize the personal medical documents and information provided by the user\nSummarize and provide the OUTPUT in a LOGBOOK format, making it legible and clear enough to be read by Doctors/Medical experts\nOnly return the summary and nothing else\n DON\'T TITLE IT AS LOGBOOK OR ANYTHING, GO STRAIGHT TO THE BODY\nUse text formatting tile well, bold the sub-titles, eg Date, etc\nFor each event (check the dates of the bills / prescription) EVERY THING MUST BE A LIST. List out the following things: Make sure that the logbook format is: Date, Hospital / Doctor / Medical Name, Diagnosis Title (if it's Doctor or Hospital), (Address, Phone Number, Email) (if provided), Diagnosis Summary, Medications List (Along with schedule if mentioned), Any other remarks if present. If No context is provided, reply with: No documents uploaded yet, upload your medical related documents in the Upload Documents tab."
                })
            }).then(response => {
                if (!response.ok) {
                    throw Error('Can\'t Process the Promise')
                }
                return response.json()
            }).then(data => {
                setUserSummary(data['content'])
            })
        } catch (e) {
            console.error('Chat Fetch Error: ' + e)
        }
    }, [])
    
    
    return (
        <main className="dash-board flex-col">
            {userData && 
            <>
                <strong className='profile-subsection-title'>About Me:</strong>
                <section className="profile-subsection flex-col">
                    <strong className="profile-name">{userData.name}</strong>
                    <strong className="profile-title">Age: {userData.age}</strong>
                    <strong className="profile-title">Gender: {gender[userData.gender]}</strong>
                    <strong className="profile-title">Height: {userData.height} cm</strong>
                    <strong className="profile-title">Weight: {userData.weight} kg</strong>
                </section>
                <strong className='profile-subsection-title'>Summary:</strong>
                <section className="profile-subsection flex-col" id='summary-text'>
                    <ReactMarkdown>{userSummary}</ReactMarkdown>
                </section>
            </>}
            {!userData && <strong>Redirecting to Login ...</strong>}
        </main>
    )
}

export default DashBoard