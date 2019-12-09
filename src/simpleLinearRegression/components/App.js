import React from 'react';
import { connect } from 'react-redux';
import { getData } from '../actions';
import { plot, createModel, splitTrainTestData, trainModel } from './tf';

// const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');

class App extends React.Component {
    state = { 
        isDataLoading: false,
        isModelTraining: false,
        isModelTesting: false,
        loadDataButtonText: 'Load Data',
        model: {},
        X_train: [],
        y_train: [],
        X_test: [],
        y_test: [],
        train_loss: '',
        val_loss: '',
        test_loss: '',
        metric: '',
        prediction: ''
    }

    componentDidMount() {
        tfvis.visor().close();
    }

    // componentDidUpdate(object prevProps, object prevState)
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('hello update');
            this.setState({
                loadDataButtonText: 'Data Loaded',
                isDataLoading: false
            });
        }
    }

    handleTFVIS = () => {
        tfvis.visor().toggle();
    }

    loadData = () => {        
        this.setState({ isDataLoading: true });
        this.props.getData();
    }

    plotData = () => {
        tfvis.visor().open();
        plot(this.props.data, "Square Feet");        
    }

    splitData = async () => {
        const [X_train, y_train, X_test, y_test] = await splitTrainTestData(this.props.data[0]);
        this.setState({
            X_train: X_train,
            y_train: y_train,
            X_test: X_test,
            y_test: y_test
        });
    }

    createModel = () => {
        const model = createModel();
        this.setState({ model: model });
        const layer = model.getLayer(undefined, 0);
        
        tfvis.show.modelSummary({ name: `Model Summary`, tab: `Model` }, model);
        tfvis.show.layer({ name: `Layer 1`, tab: `Model Inspection` }, layer);
        tfvis.visor().open();
    }

    trainModel = async () => {
        tfvis.visor().setActiveTab('Visor');
        tfvis.visor().open();
        this.setState({ isModelTraining: true })
        const { model, X_train, y_train } = this.state;
        const result = await trainModel(model, X_train, y_train);
        const trainLoss = result.history.loss.pop();
        console.log(`Training loss: ${trainLoss}`);

        const valLoss = result.history.val_loss.pop();
        console.log(`Validation loss: ${valLoss}`); 
        
        this.setState({
            isModelTraining: false, 
            train_loss: trainLoss,
            val_loss: valLoss
        });
    }

    testModel = async () => {
        this.setState({ isModelTesting: true });
        const { model, X_test, y_test } = this.state;
        const testTensor = await model.evaluate(X_test, y_test);
        const testLoss = testTensor.dataSync();
        console.log(`Testing loss: ${testLoss}`);

        this.setState({ 
            isModelTesting: false,
            test_loss: testLoss
        });
    }

    renderLoader = () => {
        if (this.state.isLoading) {
            return (
                <div className="ui segment">
                    <div className="ui active dimmer">
                        <div className="ui text loader">
                            {this.state.loadingMsg}
                        </div>
                    </div>
                    <br /><br />
                </div>
            )
        }
    }

    renderLoadDataButton = () => {
        if (this.state.isDataLoading) {
            return (
                <button className="ui loading button">Loading</button>
            )
        } else {
            return (
                <button onClick={this.loadData} className="ui button">{this.state.loadDataButtonText}</button>
            )
        }
    }

    renderTrainingModelButton = () => {
        if (this.state.isModelTraining) {
            return (
                <button className="ui loading button">Loading</button>
            )
        } else {
            return (
                <button onClick={this.trainModel} className="ui button">Train Model</button>
            )
        }
    }

    renderTestingModelButton = () => {
        if (this.state.isModelTesting) {
            return (
                <button className="ui loading button">Loading</button>
            )
        } else {
            return (
                <button onClick={this.testModel} className="ui button">Test Model</button>
            )
        }
    }

    render () {
        return (
            <div className="ui container">
                <h2>Simple Linear Regression</h2> 
                {/* {this.renderLoader()} 
                <br /><br /> */}
                <div>                     
                    <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>                   
                </div>
                <br /><br />
                <div className="ui two column celled grid">
                    <div className="column">
                        <div className="column" style={{paddingBottom: "13px"}}>
                            <h3>Load Data</h3> 
                        </div>
                        <div className="ui three column grid">
                            <div className="column">
                                <select className="ui dropdown">
                                    <option value="">Load Data</option>
                                    <option value="1">KC Housing Prices</option>
                                </select>
                            </div>
                            <div className="column">
                                {this.renderLoadDataButton()}
                            </div>
                            <div className="column"></div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="column" style={{paddingBottom: "13px"}}>
                            <h3>Plot Data</h3>
                        </div>
                        <div className="ui three column grid">
                            <div className="column">
                                <select className="ui dropdown">
                                <option value="">Plot</option>
                                <option value="1">Scatterplot</option>
                                </select>
                            </div>
                            <div className="column">
                                <button onClick={this.plotData} className="ui button">Plot Data</button>
                            </div>
                            <div className="column"></div> 
                        </div>
                    </div>                                    
                </div>
                <div className="ui one column celled grid">
                    <div className="column">
                        <h3>Split Train Test Data</h3>
                        <button onClick={this.splitData} className="ui button">Split Data</button>
                    </div>                    
                </div>
                <div className="ui one column celled grid">
                    <div className="column">
                        <h3>Create Model</h3>
                        <div className="ui five column grid">
                            <div className="column">
                                <h4>Layers</h4>
                                <button>Add Layer</button>
                            </div>
                            <div className="column"></div>
                            <div className="column">
                                <h4>Optimizer</h4>
                                <div className="grouped fields">
                                    <label>Choose optimiser</label>
                                    <div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="optimizer" />
                                            <label>SGD</label>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="optimizer" />
                                            <label>ADAM</label>
                                        </div>
                                    </div>
                                    <div className="field">
                                    <div className="ui radio checkbox">
                                        <input type="radio" name="optimiser" />
                                        <label>RMSProp</label>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <h4>Loss Function</h4>
                                <div className="grouped fields">
                                    <label>Choose loss function</label>
                                    <div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="lossfunction"  />
                                            <label>MSE</label>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" name="lossfunction" />
                                            <label>MAE</label>
                                        </div>
                                    </div>
                                    <div className="field">
                                    <div className="ui radio checkbox">
                                        <input type="radio" name="lossfunction" />
                                        <label>RMSE</label>
                                    </div>
                                    </div>
                                </div>
                            </div>                            
                            <div className="column"></div>
                        </div>
                    </div>
                    <div className="column">
                        <button onClick={this.createModel} className="ui button">Create Model</button>
                        <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                    </div>
                </div>
                <div className="ui two column celled grid">                    
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
                    <div className="column">
                        <h3>Test Model</h3>
                        <div className="ui three column grid">                                                        
                            <div className="column">
                                
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
                            </div>
                            <div className="column">
                                {this.renderTestingModelButton()}
                                <br /><br />
                                <div className="ui labeled input">
                                    <div className="ui label">
                                        Testing Loss
                                    </div>
                                    <input type="text" placeholder="testing loss" value={this.state.test_loss} readOnly />
                                </div>
                            </div>
                            <div className="column"></div>
                        </div> 
                    </div>
                </div> 
                <div className="ui two column celled grid">
                    <div className="column">
                        <div className="column" style={{paddingBottom: "13px"}}>
                            <h3>Model Management</h3> 
                        </div>                        
                        <div className="ui three column grid">
                            <div className="column">
                                <button className="ui button">Save Model</button>
                            </div>
                            <div className="column">
                                <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                            </div>
                            <div className="column">
                                <select className="ui dropdown">
                                    <option value="">Choose Model</option>
                                    <option value="1">Model 1</option>
                                </select>
                                <br /><br />
                                <button className="ui button">Load Model</button>
                            </div>                            
                        </div>
                    </div>
                    <div className="column">
                        <div className="column" style={{paddingBottom: "13px"}}>
                            <h3>Make Prediction</h3>
                        </div>
                        <div className="ui three column grid">
                            <div className="column">
                                <div className="ui input">
                                    <input type="text" placeholder="enter value" />
                                </div>
                                <br /><br />
                                <div className="ui labeled input">
                                    <div className="ui label">
                                        Predicted Value
                                    </div>
                                    <input type="text" placeholder="predicted value" value={this.state.prediction} readOnly />
                                </div>
                            </div>                             
                            <div className="column">
                                <button className="ui button">Predict</button>                                                              
                            </div>
                            <div className="column"></div>                            
                        </div>
                    </div>                                    
                </div>                     
            </div>
        )
    }    
}

const mapStateToProps = state => {     
    return { data: state.data }
}

export default connect(mapStateToProps, { getData })(App);