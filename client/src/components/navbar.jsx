import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return(
        <div id='navbar'>
            <Link to="/" className='link'><h1 id='navbar-text'>Minesweeper 1v1 Online 🚩</h1></Link>
        </div>
    );
}