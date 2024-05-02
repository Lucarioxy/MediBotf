import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashBoard from './ProfilePage/DashBoard'
import './style.css'

function ProfilePage () {
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem('user-data'))

    useEffect(() => {
        if (!userData)
            navigate('/')
    }, [])
    
    const handleBackButtonClick = () => {
        navigate('/chat')
    }
    
    return (
        <main className="page profile-page">
            <button onClick={handleBackButtonClick} className='no-display'><img src="arrow-back.svg" alt="Go-Back" /></button>
            <DashBoard />
        </main>
    )
}

export { ProfilePage }