import { React, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import MainFooter from "./mainFooter";

export default function JoinInfo(props) {
    let link = "http://localhost:3000/game/" + props.socketId;
    const [linkCopied, setLinkCopied] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    function handleLinkCopy() {
        navigator.clipboard.writeText(link);
        setCodeCopied(false)
        setLinkCopied(true);
    }

    function handleCodeCopy() {
        navigator.clipboard.writeText(props.socketId);
        setLinkCopied(false)
        setCodeCopied(true);
    }

    return(
        <div className="ui-content">
            <Navbar />
            <h1 className="name-big">Room Info</h1>
            <div className="center-box">
                <div id="link-div">
                    <h1 className="text-in-center-box">Invite Link:</h1>
                    <h1 id="game-link">{link}</h1>
                </div>
                <h1 className="text-in-center-box">Room Code: {props.socketId}</h1>
                <div>                
                    <button className="small-button" onClick={handleLinkCopy}>Copy Link</button>
                    <button className="small-button" onClick={handleCodeCopy}>Copy Code</button>
                </div>
                {linkCopied && 
                    <h1 className="text-in-center-box">Link Copied</h1>
                }
                {codeCopied && 
                    <h1 className="text-in-center-box">Code Copied</h1>
                }
            </div>
            <Link to="/gamesettings"><button className="big-button">back</button></Link>
            <MainFooter />
        </div>
    );
}