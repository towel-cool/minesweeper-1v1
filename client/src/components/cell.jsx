import React from "react";

export default function Cell(props) {
    const isRevealed = props.revealed;
    const neighboringMines = props.neighborMines;
    const isMine = props.mine;
    const index = props.index;
    const isFlagged = props.isFlagged;
    const clickable = props.isClickable;
    const gameLost = props.lost;
    const losingClick = props.losingClick;

    function handleClick() {
        // call click function on left click
        if (!clickable)
            return
        else if (props.boardCreated === false) {
            props.createBoardFunc(index[0],index[1]);
        }
        props.clickfunc(index[0], index[1], neighboringMines);
    }

    function handleRightClick(e) {
        //call flag function on right click
        e.preventDefault();
        if (!clickable)
            return
        else if (props.boardCreated === false)
            return
        else if (isRevealed)
            return

        props.rightclickfunc(index[0], index[1]);
    }


    // number coloring based on number of neighboring mines    
    const oneTile = {
        color: '#3278CC',
    }
    const twoTiles = { 
        color: '#65C12D',
    }
    const threeTile = {
        color: '#D11B26',
    }
    const fourTile = {
        color: '#3449DC',
    }
    const fiveTile = {
        color: '#8A0000',
    }
    const sixTile = {
        color: '#0CA1D1',
    }
    const sevenTile = {
        color: '#000000',
    }
    const eightTile = {
        color: '#C1C1C1',
    }

    // cases for creating a lose board
    if (gameLost) {
        if (isRevealed && isMine && gameLost && !isFlagged && losingClick === false) {
            return(
                <div className="mine-cell">💣</div>
            );
        }
        else if (isRevealed && isMine && gameLost && losingClick === true) {
            return(
                <div className="mine-cell-click">💣</div>
            );
        }
        else if (isFlagged && isMine && gameLost) {
            return(
                <div className="flagged-cell" onContextMenu={handleRightClick}>⚑</div>
            );
        }
        else if (isFlagged && !isMine && gameLost) {
            return(
                <div className="wrong-flag">❌</div>
            );
        }
        else if (!isRevealed && !isFlagged) {
            return (
                <div className="hidden-cell" onClick={handleClick} onContextMenu={handleRightClick}></div>
            );
        }
        else if (isRevealed && neighboringMines !== 0) {
            // based on neighboring mines return appropriate number coloring
            switch (neighboringMines) {
                case 1:
                    return(<div style={oneTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 2:
                    return(<div style={twoTiles} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 3:
                    return(<div style={threeTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 4:
                    return(<div style={fourTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 5:
                    return(<div style={fiveTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 6:
                    return(<div style={sixTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 7:
                    return(<div style={sevenTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 8: 
                    return(<div style={eightTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                default:
                    return
            }
        }
        else if (isRevealed && neighboringMines === 0) {
            return (
                <div className="inner-cell"></div>
            );
        }
    }
    // cases for playing board
    else {
        if (!isRevealed && isFlagged) {
            return(
                <div className="flagged-cell" onContextMenu={handleRightClick}>⚑</div>
            );
        }
        else if (!isRevealed && !isFlagged) {
            return (
                <div className="hidden-cell" onClick={handleClick} onContextMenu={handleRightClick}></div>
            );
        }
        else if (isRevealed && neighboringMines !== 0) {
            // based on neighboring mines return appropriate number coloring
            switch (neighboringMines) {
                case 1:
                    return(<div style={oneTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 2:
                    return(<div style={twoTiles} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 3:
                    return(<div style={threeTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 4:
                    return(<div style={fourTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 5:
                    return(<div style={fiveTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 6:
                    return(<div style={sixTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 7:
                    return(<div style={sevenTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                case 8: 
                    return(<div style={eightTile} className="revealed-cell" onClick={handleClick} onContextMenu={handleRightClick}>{neighboringMines}</div>);
                default:
                    return
            }
        }
        else if (isRevealed && neighboringMines === 0) {
            return (
                <div className="inner-cell"></div>
            );
        }
    }
}
