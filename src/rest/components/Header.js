import React from 'react';
import { Link } from 'react-router-dom';
import Auth from './AuthPlaceHolder';

const Header = () => {
    return (
        <div>
            <div className="ui secondary pointing menu">
                <Link to='/' className="item header">REST Home (start json-server)</Link>
                <div className="right menu">
                    <Link to='/route/list' className="item header">List Resources</Link>
                </div>
                <Auth />
            </div>
        </div>
    )
}

export default Header;