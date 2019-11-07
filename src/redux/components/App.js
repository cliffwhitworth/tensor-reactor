import React from 'react';
import ActionList from './ActionList';
import ActionDetails from './ActionDetails';

// Provider -> App -> Connect -> Children that use store

const App = () => {
    return (
        <div className="ui container grid" style={{marginTop: "23px"}}>
            <h2>React Redux App</h2>
            <div className="row">
                <div className="column eight wide">
                    <ActionList />
                </div>
                <div className="column eight wide">
                    <ActionDetails />
                </div>
            </div>            
        </div>
    )
};

export default App;