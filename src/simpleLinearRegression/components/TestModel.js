import React from 'react';
import { connect } from 'react-redux';
import { createSaveableModelState, createPredictReadyState } from '../actions';

class TestModel extends React.Component {

    state = { 
            isModelTesting: null,
            test_loss: '' 
        }

    testModel = async () => {
        this.setState({ isModelTesting: true });
        const model = this.props.model;
        const { X_test, y_test } = this.props.trainTestTensors;
        const testTensor = await model.evaluate(X_test, y_test);
        const testLoss = testTensor.dataSync();
        console.log(`Testing loss: ${testLoss}`);

        this.props.createSaveableModelState();
        this.props.createPredictReadyState();

        this.setState({ 
            isModelTesting: false,
            test_loss: testLoss
        });
    }

    renderTestingModelButton = () => {
        if (this.state.isModelTesting) {
            return (
                <button className="ui loading button">Loading</button>
            )
        } else {
            return (
                <button onClick={this.testModel} className="ui button" disabled={!this.props.isModelTrained}>Test Model</button>
            )
        }
    }

    render() {
        return (
            <div className="ui one column celled grid">
                <div className="column" style={{paddingBottom: "13px"}}>   
                    <h3>Test Model</h3>                                 
                    <div className="grouped fields">
                        <label>Metrics</label>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="metrics"  />
                                <label>MSE</label>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="metrics" />
                                <label>MAE</label>
                            </div>
                        </div>
                        <div className="field">
                        <div className="ui radio checkbox">
                            <input type="radio" name="metrics" />
                            <label>R Squared</label>
                        </div>
                        </div>                                    
                    </div> 
                    <br />                   
                    {this.renderTestingModelButton()}
                    <br /><br />
                    <div className="ui labeled input">
                        <div className="ui label">
                            Testing Loss
                        </div>
                        <input type="text" placeholder="testing loss" value={this.state.test_loss} readOnly />
                    </div>                       
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        model: state.store.model,
        isModelTrained: state.store.isModelTrained,
        trainTestTensors: state.store.trainTestTensors
    }
}

export default connect(mapStateToProps, { createSaveableModelState, createPredictReadyState })(TestModel);