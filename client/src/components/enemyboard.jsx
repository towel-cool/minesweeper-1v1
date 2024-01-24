import React, { useState } from 'react';
import Cell from './cell';

export default function EnemyBoard(props) {
    const [board, setBoard] = useState([]);
    const [initialized, setInitialized] = useState(false);

    const socket = props.socket;

    function initializeBoard() {
        const newBoard = board.slice()
        for (let i = 0; i < props.rows; i++) {
            newBoard[i] =[]
        }

        for (let i = 0; i < props.rows; i++) {
            for (let j = 0; j < props.cols; j++) {
                newBoard[i][j] = <Cell mine={false} neighborMines={-1} isClickable={false}/>;
            }
        }
        setBoard(newBoard);
    }

    function updateBoard(cellInfo) {
        if (cellInfo === null) {
            initializeBoard();
            return
        }
        const newBoard = board.slice();
        if (cellInfo.index[0] < newBoard.length && cellInfo.index[1] < newBoard[0].length) {
            newBoard[cellInfo.index[0]][cellInfo.index[1]] = <Cell revealed={cellInfo.revealed} mine={cellInfo.mine} neighborMines={cellInfo.neighborMines} isFlagged={cellInfo.isFlagged} isClickable={cellInfo.isClickable} lost={cellInfo.lost} losingClick={cellInfo.losingClick} />;
            setBoard(newBoard);
        }
    }

    if (!initialized) {
        initializeBoard();
        setInitialized(true); 
    }

    socket.on('send-cell', (cellInfo) => {
        updateBoard(cellInfo);
    });

    return(
        <div id='enemy-game'>
            <h1 className='board-identifier'>Opponent</h1>
            <div className='board'>
                {board.map((row) => (
                    <div className='row'>
                        {row.map((cell) => (
                            <>{cell}</>
                        ))}
                    </div>
                ))}
            </div>           
        </div>
    );
}
