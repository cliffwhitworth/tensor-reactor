import React from 'react';
import { connect } from 'react-redux';
import { createModelAction, createTrainedModelState } from '../actions';
import { openVisor, toggleVisor, trainModel } from './tf';

class TrainModel extends React.Component {

    state = {
        isModelTraining: false,
        isModelTrained: false, 
        train_loss: '',
        val_loss: ''
    }

    handleTFVIS = () => {
        toggleVisor();
    }

    trainModel = async () => {
        openVisor();
        this.setState({ isModelTraining: true });        
        const model = this.props.model;
        const { X_min, X_max, y_min, y_max } = this.props.minMaxValues;
        const {X_train, y_train} = this.props.trainTestTensors;
        const result = await trainModel(model, X_train, y_train, this.props.data, X_min, X_max, y_min, y_max);
        this.props.createModelAction(model);
        const trainLoss = result.history.loss.pop();
        console.log(`Training loss: ${trainLoss}`);

        const valLoss = result.history.val_loss.pop();
        console.log(`Validation loss: ${valLoss}`); 
        
        this.setState({
            isModelTraining: false,
            isModelTrained: true, 
            train_loss: trainLoss,
            val_loss: valLoss
        });

        this.props.createTrainedModelState();
    }

    renderTrainingModelButton = () => {
        if (this.state.isModelTraining) {
            return (
                <button className="ui loading button">Loading</button>
            )
        } else {
            return (
                <button onClick={this.trainModel} className="ui button" disabled={!this.props.isModelCreated}>Train Model</button>
            )
        }
    }

    render() {
        return (
            <div className="ui one column celled grid">                    
                <div className="column" style={{paddingBottom: "13px"}}>
                    <h3>Train Model</h3> 
                    {this.renderTrainingModelButton()} &nbsp;
                    <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                    <br /><br />
                    <div className="ui labeled input">
                        <div className="ui label">
                            Training Loss
                        </div>
                        <input type="text" placeholder="training loss" value={this.state.train_loss} readOnly />
                    </div>
                    <br /><br />
                    <div className="ui labeled input">
                        <div className="ui label">
                            Validation Loss
                        </div>
                        <input type="text" placeholder="validation loss" value={this.state.val_loss} readOnly />
                    </div>
                </div>
            </div> 
        )
    }
}

const mapStateToProps = state => {    
    return { 
        data: state.store.data,
        isModelCreated: state.store.isModelCreated,
        model: state.store.model,
        minMaxValues: state.store.minMaxValues,
        trainTestTensors: state.store.trainTestTensors        
     }
}

export default connect(mapStateToProps, { createModelAction, createTrainedModelState })(TrainModel);