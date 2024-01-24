import React, { useState } from 'react';
import Cell from './cell';

export default function Game(props) {
    const [board, setBoard] = useState([]);
    const [loseBoard, setLoseBoard] = useState([]);
    const [lose, setLose] = useState(false);
    const [initialized, setInitialized] = useState(false);
    let numFlags = 0;
    const [remainingFlags, setRemainingFlags] = useState(props.mines - numFlags);
    const numMines = props.mines;
    let minesAdded = 0;
    let revealedCells = 0;

    let socket = props.socket;
    let emitSocket = props.emitSocket;

    function initializeBoard() {
        socket.emit('update-board', emitSocket, null);
        setLose(false);
        numFlags = 0;
        setRemainingFlags(props.mines - numFlags);
        minesAdded = 0;
        revealedCells = 0;

        //create 2d array
        for (let i = 0; i < props.rows; i++) {
            board[i] = [];
        }
        for (let i = 0; i < props.rows; i++) {
            for (let j = 0; j < props.cols; j++) {
                board[i][j] = <Cell mine={false} neighborMines={-1} index={[i,j]} isClickable={true} lost={false} boardCreated={false} createBoardFunc={createBoard} clickfunc={revealCell} />;
            }
        }
    }

    function createBoard(row, col) {
        //add mines to board
        while (minesAdded !== numMines) {
            let randRow = Math.floor(Math.random() * props.rows);
            let randCol = Math.floor(Math.random() * props.cols);
            if ((randRow !== row || randCol !== col) && board[randRow][randCol].props.mine === false) {
                board[randRow][randCol] = <Cell revealed={false} mine={true} neighborMines={-1} index={[randRow,randCol]} clickfunc={revealCell} rightclickfunc={toggleFlag} isFlagged={false} isClickable={true} lost={false}/>;
                minesAdded += 1;
            }
        }
        //add rest of cells
        for (let i = 0; i < props.rows; i++) {
            for (let j = 0; j < props.cols; j++) {
                if (board[i][j].props.mine === false) {
                    let neighborMines = getNumberOfNeighboringMines(board, i, j);
                    board[i][j] = <Cell revealed={false} mine={false} neighborMines={neighborMines} index={[i,j]} clickfunc={revealCell} rightclickfunc={toggleFlag} isFlagged={false} isClickable={true} lost={false} />;
                }
            }
        }  
    }

    function createLoseBoard() {
        let tempBoard = board.slice();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (tempBoard[i][j].props.mine === true) {
                    tempBoard[i][j] = <Cell revealed={true} isFlagged={tempBoard[i][j].props.isFlagged} mine={true} isClickable={false} lost={true} losingClick={false} />
                    socket.emit('update-board', emitSocket, {index: [i,j], mine: true, revealed: true, isFlagged: tempBoard[i][j].props.isFlagged, isClickable: false, lost: true, losingClick: false});
                }
                else {
                    tempBoard[i][j] = <Cell revealed={tempBoard[i][j].props.revealed} neighborMines={tempBoard[i][j].props.neighborMines} mine={false} isFlagged={tempBoard[i][j].props.isFlagged} isClickable={false} lost={true} losingClick={false} />
                    if (tempBoard[i][j].props.isFlagged)
                        socket.emit('update-board', emitSocket, {index: [i,j], mine: false, revealed: false, isFlagged: true, isClickable: false, lost: true, losingClick: false});
                }
            }
        }
        setLoseBoard(tempBoard);
    }

    function getNumberOfNeighboringMines(board, row, col) {
        let rowLen = board.length;
        let colLen = board[0].length;
        let mines = 0;

        if (row !== 0 && col !== 0 && board[row-1][col-1].props.mine === true)
            mines += 1;
        if (row !== 0 && board[row-1][col].props.mine === true)
            mines += 1;
        if (row !== 0 && col !== (colLen-1) && board[row-1][col+1].props.mine === true)
            mines += 1;
        if (col !== 0 && board[row][col-1].props.mine === true)
            mines += 1;
        if (col !== (colLen-1) && board[row][col+1].props.mine === true)
            mines += 1;
        if (row !== (rowLen-1) && col !== 0 && board[row+1][col-1].props.mine === true)
            mines += 1;
        if (row !== (rowLen-1) && board[row+1][col].props.mine === true)
            mines += 1;
        if (row !== (rowLen-1) && col !== (colLen-1) && board[row+1][col+1].props.mine === true)
            mines += 1;

        return mines;
    }

    function getNumberOfNeighboringFlags(row, col) {
        let rowLen = board.length;
        let colLen = board[0].length;
        let flags = 0;

        if (row !== 0 && col !== 0 && board[row-1][col-1].props.isFlagged === true)
            flags += 1;
        if (row !== 0 && board[row-1][col].props.isFlagged === true)
            flags += 1;
        if (row !== 0 && col !== (colLen-1) && board[row-1][col+1].props.isFlagged === true)
            flags += 1;
        if (col !== 0 && board[row][col-1].props.isFlagged === true)
            flags += 1;
        if (col !== (colLen-1) && board[row][col+1].props.isFlagged === true)
            flags += 1;
        if (row !== (rowLen-1) && col !== 0 && board[row+1][col-1].props.isFlagged === true)
            flags += 1;
        if (row !== (rowLen-1) && board[row+1][col].props.isFlagged === true)
            flags += 1;
        if (row !== (rowLen-1) && col !== (colLen-1) && board[row+1][col+1].props.isFlagged === true)
            flags += 1;

        return flags;
    }

    function toggleFlag(row, col) {
        if (!board[row][col].props.revealed === false)
            return
        let neighborMines = board[row][col].props.neighborMines;
        let mine = board[row][col].props.mine;
        const newBoard = board.slice();
        if (board[row][col].props.isFlagged === true)
        {
            newBoard[row][col] = <Cell revealed={false} mine={mine} neighborMines={neighborMines} index={[row,col]} clickfunc={revealCell} rightclickfunc={toggleFlag} isFlagged={false} isClickable={true} lost={false}/>;
            numFlags -= 1;
            socket.emit('update-board', emitSocket, {index: [row,col], mine: false, neighborMines: neighborMines, revealed: false, isFlagged: false, isClickable: false});
        }
        else 
        {
            newBoard[row][col] = <Cell revealed={false} mine={mine} neighborMines={neighborMines} index={[row,col]} clickfunc={revealCell} rightclickfunc={toggleFlag} isFlagged={true} isClickable={true} lost={false} />;
            numFlags += 1;
            socket.emit('update-board', emitSocket, {index: [row,col], mine: false, neighborMines: neighborMines, revealed: false, isFlagged: true, isClickable: false})
        }
        setRemainingFlags(props.mines - numFlags);
        setBoard(newBoard);       
    }

    function revealLocal(row, col) {
        //non recursive function for revealing (used when clicking on revealed tiles with full flags around)

        let rowLen = board.length;
        let colLen = board[0].length;
        if (row !== 0 && col !== 0 && !board[row-1][col-1].props.revealed === true)
            revealCell(row-1,col-1);
        if (row !== 0 && !board[row-1][col].props.revealed === true)
            revealCell(row-1,col);
        if (row !== 0 && col !== (colLen-1) && !board[row-1][col+1].props.revealed === true)
            revealCell(row-1,col+1);
        if (col !== 0 && !board[row][col-1].props.revealed === true)
            revealCell(row,col-1);
        if (col !== (colLen-1) && !board[row][col+1].props.revealed === true)
            revealCell(row,col+1);
        if (row !== (rowLen-1) && col !== 0 && !board[row+1][col-1].props.revealed === true)
            revealCell(row+1,col-1);
        if (row !== (rowLen-1) && !board[row+1][col].props.revealed === true)
            revealCell(row+1,col);
        if (row !== (rowLen-1) && col !== (colLen-1) && !board[row+1][col+1].props.revealed === true)
            revealCell(row+1,col+1);
    }

    function revealCell(row, col) {
        if (board[row][col].props.isFlagged) {
            return
        }
        if (board[row][col].props.mine) {
            setLose(true);
            createLoseBoard();
            board[row][col] = <Cell revealed={true} mine={true} isClickable={false} lost={true} losingClick={true}/>
            socket.emit('update-board', emitSocket, {index: [row,col], mine: true, revealed: true, isClickable: false, lost: true, losingClick: true});
            return
        }

        let rowLen = board.length;
        let colLen = board[0].length;

        if (board[row][col].props.revealed) {
            if (board[row][col].props.neighborMines > 0 && getNumberOfNeighboringFlags(row,col) === board[row][col].props.neighborMines) {
                revealLocal(row, col);
            }
            return
        }

        //reveal mines
        let neighborMines = board[row][col].props.neighborMines;
        const newBoard = board.slice();
        newBoard[row][col] = <Cell revealed={true} mine={false} neighborMines={neighborMines} index={[row,col]} clickfunc={revealCell} rightclickfunc={toggleFlag} isFlagged={false} isClickable={true} lost={false} />
        setBoard(newBoard);       
        socket.emit('update-board', emitSocket, {index: [row, col], revealed: true, mine: false, neighborMines: neighborMines, isFlagged: false, isClickable: false});

        revealedCells += 1;
        if (revealedCells === (rowLen * colLen) - numMines)
        {
            props.winFunc();
        }

        if (neighborMines !== 0)
            return

        //recursive revealing with checks
        if (row !== 0) {
            if (col !== 0)
                revealCell(row-1, col-1); 
            revealCell(row-1, col); 
            if (col !== (colLen-1))
                revealCell(row-1, col+1); 
        }
        if (col !== 0)
        revealCell(row, col-1); 
        if (col !== (colLen-1))
            revealCell(row, col+1); 
        if (row !== (rowLen-1)) {
            if (col !== 0)
                revealCell(row+1, col-1); 
            revealCell(row+1, col); 
            if (col !== (colLen-1))
                revealCell(row+1, col+1); 
        }
    }

    if (!initialized) {
        initializeBoard();
        setInitialized(true);
    }

    if (!lose) {
        return(
            <div id='player-game'>
                <h1 className='board-identifier'>You</h1>
                <div className='board'>
                    {board.map((row) => (
                        <div className='row'>
                            {row.map((cell) => (
                                <>{cell}</>
                            ))}
                        </div>
                    ))}
                </div>
                <h1 id='flag-counter'><h2 id='flag-symbol'>⚑</h2> {remainingFlags}</h1>
            </div>
           
        );
    }
    else {
        return(
            <div id='board-lose'>
                <h1 id='lose-text'>Lose</h1>
                {loseBoard.map((row) => (
                    <div className='row'>
                        {row.map((cell) => (
                            <>{cell}</>
                        ))}
                    </div>
                ))}
                <button onClick={initializeBoard} id='new-board-btn'>New Board</button>           
            </div>
        );
    }
}
