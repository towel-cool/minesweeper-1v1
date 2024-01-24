import React from 'react';
import { Link }from 'react-router-dom'
import Navbar from './navbar';
import MainFooter from '../components/mainFooter'

export default function OneLineWithButton(props) {
    return(
        <div className='ui-content'>
            <Navbar />
            <div className='center-box'>
                <h1 className='text-in-center-box'>{props.lineText}</h1>
                <Link to={props.to}><button className='big-button'>{props.btnText}</button></Link>
            </div>
            <MainFooter />
        </div>
    );
}