import React from 'react';
import HouseList from './HouseList';

const App = () => {
    return (
        <div style={{padding: "23px", width: "50%"}}>            
            <h2 className="ui header">
            Hello House Prices Sample!
            </h2>  
            <p>Start http-server --cors</p>
            <HouseList />                                           
        </div>
    )
}

export default App;