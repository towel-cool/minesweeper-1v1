import React, { useState } from "react";

export default function Settings(props) {
    const [numMines, setNumMines] = useState(props.gameInfo.mines);
    const [numRows, setNumRows] = useState(props.gameInfo.rows);
    const [numCols, setNumCols] = useState(props.gameInfo.cols);

    const [custNumMines, setCustNumMines] = useState(0);
    const [custNumRows, setCustNumRows] = useState(15);
    const [custNumCols, setCustNumCols] = useState(15);

    const [firstDifficultyChecked, setFirstDifficultyChecked] = useState(false);
    const [clickedCustom, setClickedCustom] = useState(false);
    const [clickedChangeSettings, setClickedChangeSettings] = useState(false);
    const [difficulty, setDifficulty] = useState(null);
    const socket = props.socket;
    const otherPlayerId = props.otherPlayerId;

    function handleCustomButtonClick() {
        if (clickedCustom)
            setClickedCustom(false);
        else 
            setClickedCustom(true);
    }

    function handleEasyButtonClick() {
        setNumMines(10);
        setNumRows(9);
        setNumCols(9);
        props.changeHostSettingsFunc(10, 9, 9);
        setDifficulty('easy');
        socket.emit('send-data', 10, 9, 9, otherPlayerId)
    }

    function handleMediumButtonClick() {
        setNumMines(40);
        setNumRows(16);
        setNumCols(16);
        props.changeHostSettingsFunc(40, 16, 16);
        setDifficulty('medium')
        socket.emit('send-data', 40, 16, 16, otherPlayerId)
    }

    function handleHardButtonClick() {
        setNumMines(99);
        setNumRows(16);
        setNumCols(30);
        props.changeHostSettingsFunc(99, 16, 30);
        setDifficulty('hard')
        socket.emit('send-data', 99, 16, 30, otherPlayerId)
    }

    function handleCustomOkButtonClick() {
        setNumMines(custNumMines);
        setNumRows(custNumRows);
        setNumCols(custNumCols);
        props.changeHostSettingsFunc(custNumMines, custNumRows, custNumCols);
        setDifficulty(`custom (mines: ${custNumMines}, height: ${custNumRows}, width: ${custNumCols})`)
        socket.emit('send-data', custNumMines, custNumRows, custNumCols, otherPlayerId)
    }

    function handleChangeSettingsButtonClick() {
        checkDifficulty();
        if (clickedChangeSettings) 
            setClickedChangeSettings(false);
        else
            setClickedChangeSettings(true);
    }

    function checkDifficulty() {
        if (firstDifficultyChecked)
            return    
        setFirstDifficultyChecked(true);
        if (numMines === 10 && numRows === 9 && numCols === 9)
            setDifficulty('easy');
        else if (numMines === 40 && numRows === 16 && numCols === 16)
            setDifficulty('medium');
        else if (numMines === 99 && numRows === 16 && numCols === 30)
            setDifficulty('hard');
        else
            setDifficulty(`custom (mines: ${numMines}, height: ${numRows}, width: ${numCols})`);
    }

    return(

        <div className="custom-settings-in-game">
            <button className="big-button" onClick={handleChangeSettingsButtonClick}>change difficulty</button>
            {clickedChangeSettings &&
            <>
                <hr className="center-box-seperator"></hr>
                <h2 className="text-in-center-box">Change Difficulty</h2>
                <h2 className="text-in-center-box">current difficulty: {difficulty}</h2>
                <div id='difficulty-selections'>
                    <button className="small-button" onClick={handleEasyButtonClick}>easy</button>
                    <button className="small-button" onClick={handleMediumButtonClick}>medium</button>
                    <button className="small-button" onClick={handleHardButtonClick}>hard</button>

                    <button className="small-button" onClick={handleCustomButtonClick}>custom</button>
                    {clickedCustom &&
                        <div className='custom-settings'>
                            <label className="text-in-center-box">mines: <input onChange={(e) => setCustNumMines(e.target.value)} type='input' className='text-input-medium' placeholder='0'></input></label>
                            <label className="text-in-center-box">height: {custNumRows}</label>
                            <input onChange={(e) => setCustNumRows(e.target.value)} type='range' className='slider-input' min='5' max='30' step='1' value={custNumRows}></input>
                            <label className="text-in-center-box">width: {custNumCols}</label>
                            <input onChange={(e) => setCustNumCols(e.target.value)} type='range' className='slider-input' min='5' max='30' step='1' value={custNumCols}></input>
                            {custNumMines / (custNumRows * custNumCols) <= 0.60 && custNumMines > 0 &&
                                <button onClick={handleCustomOkButtonClick} className="small-button">OK</button>
                            }
                            {custNumMines / (custNumRows * custNumCols) > 0.60 &&
                                <h1 id="mine-error-text">Too many mines for the number of cells</h1>
                            }
                        </div>
                    }
                </div>
                <hr className="center-box-seperator"></hr>
            </>
            }
        </div>
    );
}