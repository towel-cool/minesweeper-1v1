import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar';
import MainFooter from '../components/mainFooter';

export default function GameSettingsPage() {
    const [numMines, setNumMines] = useState(0);
    const [numRows, setNumRows] = useState(15);
    const [numCols, setNumCols] = useState(15);
    const [clickedCustom, setClickedCustom] = useState(false);

    function handleCustomButtonClick() {
        if (clickedCustom)
            setClickedCustom(false);
        else 
            setClickedCustom(true);
    }

    const data = {
        mines: numMines,
        rows: numRows,
        cols: numCols,
    };

    return(
        <div className='ui-content'>
            <Navbar />
            <h1 className='name-big'>Choose Difficulty</h1>
            <div class='center-box'>
                <Link to="/game" state={{mines: 10, rows: 9, cols: 9}}><button className='big-button'>easy</button></Link>
                <Link to="/game" state={{mines: 40, rows: 16, cols: 16}}><button className='big-button'>medium</button></Link>
                <Link to="/game" state={{mines: 99, rows: 16, cols: 30}}><button className='big-button'>hard</button></Link>

                <button onClick={handleCustomButtonClick} className='big-button'>custom</button>
                {clickedCustom &&
                    <div className='custom-settings'>
                        <label className='text-in-center-box'>mines: <input onChange={(e) => setNumMines(e.target.value)} type='input' className='text-input-small' placeholder='0'></input></label>
                        <label className='text-in-center-box'>height: {numRows}</label>
                        <input onChange={(e) => setNumRows(e.target.value)} type='range' className='slider-input' min='5' max='30' step='1' value={numRows}></input>
                        <label className='text-in-center-box'>width: {numCols}</label>
                        <input onChange={(e) => setNumCols(e.target.value)} type='range' className='slider-input' min='5' max='30' step='1' value={numCols}></input>
                        {numMines / (numRows * numCols) <= 0.60 && numMines > 0 &&
                            <Link to="/game" state={data}><button className='big-button'>OK</button></Link>
                        }
                        {numMines / (numRows * numCols) > 0.60 &&
                            <h1 id='mine-error-text'>Too many mines for the number of cells</h1>
                        }
                    </div>
                }
            </div>
            <Link to='/'><button className='big-button'>back</button></Link>
            <MainFooter />
        </div>
            );
}