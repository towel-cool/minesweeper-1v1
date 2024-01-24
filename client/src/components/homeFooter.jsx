import React from "react";
import MainFooter from './mainFooter';

export default function HomeFooter() {

    return(
        <div id="home-footer">
            <div id="home-footer-content">
                <div id="footer-container">
                    <h1 className="title-in-footer-container">About</h1>
                    <p className="text-in-footer-container">Minesweeper 1v1 Online is a multiplayer version of minesweeper where 2 players battle to complete a minesweeper board. The first player to complete a board is the winner.</p>
                </div>
                <div id="footer-container">
                    <h1 className="title-in-footer-container">How to Play</h1>
                    <p className="text-in-footer-container">1. Click on the CREATE GAME button.</p>
                    <p className="text-in-footer-container">2. Choose a difficulty for the game.</p>
                    <p className="text-in-footer-container">3. Send either the invite link or room code to the other player.</p>
                    <p className="text-in-footer-container">4. Have Fun.</p>
                </div>
                <div id="footer-container">
                    <h1 className="title-in-footer-container">Controls</h1>
                    <p className="text-in-footer-container">Reveal Tile: Left Click (LMB)</p>
                    <p className="text-in-footer-container">Flag Tile: Right Click (RMB)</p>
                    <p className="text-in-footer-container">Chord: Left Click (LMB)</p>
                </div>
            </div>
            <MainFooter />
        </div>

    );
}