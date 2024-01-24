import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import MainFooter from '../components/mainFooter';

export default function JoinGamePage() {
    const [roomCode, setRoomCode] = useState("");

    const data = {
        code: roomCode,
    };

    return(
        <div className='ui-content'>
            <Navbar />
            <p className='name-big'>Enter Room Code:</p> 
            <div className='center-box'>
                <input className='text-input-big' type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)}></input>
                {roomCode.length > 0 &&
                    <Link to='/game' state={data}><button className='big-button'>join</button></Link>
                }
                {roomCode.length === 0 &&
                    <button className='invalid-button'>join</button>
                }
            </div>
            <Link to='/'><button className='big-button'>back</button></Link>
            <MainFooter />
        </div>
    );
}
