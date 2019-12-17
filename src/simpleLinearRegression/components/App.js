import React from 'react';
import { openVisor, toggleVisor } from './tf';

import LoadData from './LoadData';
import PlotData from './PlotData';
import SplitData from './SplitData';
import CreateModel from './CreateModel';
import TrainModel from './TrainModel';
import TestModel from './TestModel';
import ManageModel from './ManageModel';
import MakePrediction from './MakePrediction';

class App extends React.Component {

    componentDidMount() {
        openVisor();
    }

    // componentDidUpdate(object prevProps, object prevState)
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('hello update');            
        }
    }

    handleTFVIS = () => {
        toggleVisor();
    }

    render () {
        return (
            <div className="ui container">
                <h2>Simple Linear Regression</h2> 
                <div>                     
                    <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>                   
                </div>
                <br /><br />
                <LoadData />
                <PlotData />
                <SplitData />
                <CreateModel />
                <TrainModel />
                <TestModel />
                <ManageModel />
                <MakePrediction />
            </div>
        )
    }    
}

export default App;