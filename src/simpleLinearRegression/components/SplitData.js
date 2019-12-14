import React from 'react';
import { connect } from 'react-redux';
import { splitData, fillMinMaxObject, fillTrainTestObject } from '../actions';
import { closeVisor, toggleVisor, splitTrainTestData } from './tf';

class SplitData extends React.Component {

    state = {
        splitDataButtonText: 'Split Data'
    }

    handleTFVIS = () => {
        toggleVisor();
    }

    splitData = async () => {
        this.props.splitData();
        const [X_min, X_max, y_min, y_max, X_train, y_train, X_test, y_test] = await splitTrainTestData(this.props.data);
        const minMaxValues = { 'X_min': X_min, 'X_max': X_max, 'y_min': y_min, 'y_max': y_max };
        const trainTestTensors = { 'X_train': X_train, 'y_train': y_train, 'X_test': X_test, 'y_test': y_test };
        this.props.fillMinMaxObject(minMaxValues);
        this.props.fillTrainTestObject(trainTestTensors);
        this.setState({
            splitDataButtonText: 'Data Split'
        });

        closeVisor();
    }

    render() {
        return (
            <div className="ui one column celled grid">
                <div className="column">
                    <h3>Split Train Test Data</h3>
                    <button onClick={this.splitData} className="ui button" disabled={!this.props.isDataPlotted}>{this.state.splitDataButtonText}</button> &nbsp;
                    <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                </div>                    
            </div>
        )
    }
}

const mapStateToProps = state => {   
    return { 
        data: state.store.data,
        isDataPlotted: state.store.isDataPlotted
    }
}

export default connect(mapStateToProps, { splitData, fillMinMaxObject, fillTrainTestObject })(SplitData);