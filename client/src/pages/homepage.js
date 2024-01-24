import React from "react";
import { Link } from 'react-router-dom';
import HomeFooter from '../components/homeFooter';

export default function HomePage() {
    return (
        <div className="ui-content">
            <h1 id="main-menu-name">Minesweeper 1v1 Online 🚩</h1>
            <div className="center-box">
                <Link to="/gamesettings"><button className="big-button">Create Game</button></Link>
                <Link to="/joingame"><button className="big-button">Join Game</button></Link>
            </div>       
            <HomeFooter />
        </div>
    );
}