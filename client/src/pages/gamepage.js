import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import EnemyBoard from "../components/enemyboard";
import Game from "../components/game";
import Settings from "../components/settings";
import JoinInfo from "../components/joininfo";
import OneLineWithButton from "../components/oneLineWithButton";
import Navbar from '../components/navbar';
import MainFooter from "../components/mainFooter";

export default function GamePage() {
    let location = useLocation();
    let data = location.state;
    const paramInfo = useParams();

    const [socket, setSocket] = useState(null);
    const [win, setWin] = useState(false);
    const [lose, setLose] = useState(false);
    const [opponentLeft, setOpponentLeft] = useState(false);
    const [otherPlayerId, setOtherPlayerId] = useState(null);

    // vars for player joining game
    const [joinError, setJoinError] = useState(null);
    const [gameMines, setGameMines] = useState(null);
    const [gameRows, setGameRows] = useState(null);
    const [gameCols, setGameCols] = useState(null);

    // vars for player creating game
    const [otherPlayerJoined, setOtherPlayerJoined] = useState(false);

    function handleWin() {
        setWin(true);    
    }

    function handlePlayAgain() {
        socket.emit('play-again', otherPlayerId);
        setWin(false);
        setLose(false);        
    }

    function handleChangeDifficultyHostSide(numMines, numRows, numCols) {
        location.state.mines = numMines;
        location.state.rows = numRows;
        location.state.cols = numCols;
        data = location.state;
    }

    // create websocket on component mount
    useEffect(() => {
        const newSocket = io('http://localhost:3001');

        newSocket.on('connect', () => {
            setSocket(newSocket);
        });

        // disconnect socket in component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    //case where user joins match
    if (paramInfo.roomCode || data.code) {
        if (socket != null) {
            if (paramInfo.roomCode && otherPlayerId === null)
                setOtherPlayerId(paramInfo.roomCode);
            else if (otherPlayerId === null)
                setOtherPlayerId(data.code);

            socket.emit('check-can-join', otherPlayerId, socket.id, cb => {
                if (cb === 1) {
                    setJoinError(1);
                    return
                }
                if (cb === 2) {
                    setJoinError(2);                
                    return
                }
                setJoinError(0);
            });

            if (joinError === 1) {
                return (<OneLineWithButton lineText={"room does not exist"} btnText={"back"} to={"/joingame"} />);
            }
            else if (joinError === 2) {
                return (<OneLineWithButton lineText={"room is full"} btnText={"back"} to={"/"} />);
            }
            else if (joinError === 0) {
                socket.emit('room-joined', otherPlayerId, socket.id);
                socket.on('set-data', (mines, rows, cols) => {
                    setGameMines(mines);
                    setGameRows(rows);
                    setGameCols(cols);
                });
                if (gameMines != null) {
                    socket.on('room-closed', () => {
                        setOpponentLeft(true);
                    });
                    if (opponentLeft) {
                        return(<OneLineWithButton lineText={"opponent left the game"} btnText={"leave"} to={"/"} />);
                    }
                    else if (!win && !lose) {
                        socket.on('lose', () => {
                            setLose(true);
                        });
                        return(
                            <div className="ui-content">
                                <Navbar />
                                <div className='game'>
                                    <Game mines={parseInt(gameMines)} rows={parseInt(gameRows)} cols={parseInt(gameCols)} winFunc={handleWin} socket={socket} emitSocket={otherPlayerId} />
                                    <EnemyBoard rows={parseInt(gameRows)} cols={parseInt(gameCols)} socket={socket} />
                                </div>
                                <MainFooter />
                            </div>
                        );
                    }
                    else if (win) {
                        socket.emit('player-win', otherPlayerId);
                        socket.on('tell-play-again', () => {
                            handlePlayAgain();
                        });
                        socket.on('set-data', (mines, rows, cols) => {
                            setGameMines(mines);
                            setGameRows(rows);
                            setGameCols(cols);
                        });
                        return(
                            <div className="ui-content">
                                <Navbar />
                                <div className="center-box">
                                    <h1 className="text-in-center-box">You Win!</h1>
                                    <h1 className="text-in-center-box">waiting for host to start a new game</h1>
                                    <Link to='/'><button className='big-button'>leave</button></Link>
                                </div>
                                <MainFooter />
                            </div>
                        );
                    }
                    else if (lose) {
                        socket.on('tell-play-again', () => {
                            handlePlayAgain();
                        });
                        socket.on('set-data', (mines, rows, cols) => {
                            setGameMines(mines);
                            setGameRows(rows);
                            setGameCols(cols);
                        });
                        return(
                            <div className="ui-content">
                                <Navbar />
                                <div className="center-box">
                                    <h1 className="text-in-center-box">You Lose!</h1>
                                    <h1 className="text-in-center-box">waiting for host to start a new game</h1>
                                    <Link to='/'><button className='big-button'>leave</button></Link>
                                </div>
                                <MainFooter />
                            </div>
                        ); 
                    }
                }
                else {
                    return (<OneLineWithButton lineText={"waiting for game data"} btnText={"leave"} to={"/"} />);
                }
            }
        }
        else {
            return(<OneLineWithButton lineText={"connecting"} btnText={"leave"} to={"/"} />);
        }
    }
    // case where use creates a match
    else {
        if (socket !== null) {
            if (otherPlayerJoined) {
                socket.on('room-closed', () => {
                    setOpponentLeft(true);
                });
                if (opponentLeft) {
                    return(<OneLineWithButton lineText={"opponent left the game"} btnText={"leave"} to={"/"} />);
                }
                else if (!win && !lose) {
                    socket.on('lose', () => {
                        setLose(true);
                    });
                    return(
                        <div className="ui-content">
                            <Navbar />
                            <div className='game'>
                                <Game mines={parseInt(data.mines)} rows={parseInt(data.rows)} cols={parseInt(data.cols)} winFunc={handleWin} socket={socket} emitSocket={otherPlayerId} />
                                <EnemyBoard rows={parseInt(data.rows)} cols={parseInt(data.cols)} socket={socket} />
                            </div>
                            <MainFooter />
                        </div>

                    );
                }
                else if (win) {
                    socket.emit('player-win', otherPlayerId);
                    return(
                        <div className="ui-content">
                            <Navbar />
                            <div className="center-box">
                                <h1 className="text-in-center-box">You Win!</h1>
                                <button className="big-button" onClick={handlePlayAgain}>play again</button>
                                <Settings socket={socket} otherPlayerId={otherPlayerId} changeHostSettingsFunc={handleChangeDifficultyHostSide} gameInfo={{mines: data.mines, rows: data.rows, cols: data.cols}}/>
                                <Link to='/'><button className="big-button">leave</button></Link>
                            </div>
                            <MainFooter />
                        </div>
                    );
                }
                else if (lose) {
                    return(
                        <div className="ui-content">
                            <Navbar />
                            <div className="center-box">
                                <h1 className="text-in-center-box">You Lose!</h1>
                                <button className="big-button" onClick={handlePlayAgain}>play again</button>
                                <Settings socket={socket} otherPlayerId={otherPlayerId} changeHostSettingsFunc={handleChangeDifficultyHostSide} gameInfo={{mines: data.mines, rows: data.rows, cols: data.cols}}/>
                                <Link to='/'><button className="big-button">leave</button></Link>
                            </div>
                            <MainFooter />
                        </div>
                    );
                }
            }
            else {
                socket.on('other-player-joined', (id) => {
                    setOtherPlayerId(id);
                    socket.emit('send-data', data.mines, data.rows, data.cols, id);
                    setOtherPlayerJoined(true);
                });
                return(
                    <JoinInfo socketId={socket.id} />
                );
            }
        }
        else {
            return (<OneLineWithButton lineText={"connecting"} btnText={"leave"} to={"/"} />);
        }
    }
}