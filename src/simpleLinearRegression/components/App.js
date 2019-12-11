import React from 'react';
import { connect } from 'react-redux';
import { getData } from '../actions';
import { plot, createModel, splitTrainTestData, trainModel, normalizeTensor, denormalizeTensor } from './tf';

const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');

class App extends React.Component {

    constructor(props) {
        super(props)        
        this.saveModelAs = React.createRef();
        this.userPred = React.createRef();       
    }

    state = {
        isDataLoading: false,
        isLoadDataButtonDisabled: true,           
        loadDataButtonText: 'Load Data',       
        train_loss: '',
        val_loss: '',
        test_loss: '',
        metric: '',
        prediction: ''
    }

    componentDidMount() {
        this.initState();
        tfvis.visor().close();
    }

    // componentDidUpdate(object prevProps, object prevState)
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('hello update');
            this.setState({
                loadDataButtonText: 'Data Loaded',
                isDataLoaded: true,
                isDataLoading: false
            });
        }
    }

    initState = () => {
        this.setState({ 
            isDataLoading: false,
            isLoadDataButtonDisabled: true, 
            isLoadModelButtonDisabled: true,       
            isDataLoaded: false,
            isDataPlotted: false,
            isDataSplit: false,
            isModelCreated: false,
            isModelTraining: false,
            isModelTrained: false,
            isModelTesting: false,
            isModelSaveable: false,
            isPredictReady: false,
            loadDataButtonText: 'Load Data',
            loadModelName: '',
            model: {},
            modelName: '',
            X_min: 0,
            X_max: 0,
            y_min: 0,
            y_max: 0,
            X_train: [],
            y_train: [],
            X_test: [],
            y_test: [],
            train_loss: '',
            val_loss: '',
            test_loss: '',
            metric: '',
            prediction: ''
        });
    }

    handleTFVIS = () => {
        tfvis.visor().toggle();
    }

    loadData = () => {        
        this.setState({ isDataLoading: true });
        this.props.getData();
    }

    saveModelName = e => {
        this.setState({ 
            modelName: e.target.value,
            isLoadDataButtonDisabled: e.target.value?false:true 
        })
    }

    handleLoadModelName = e => {
        this.setState({ 
            loadModelName: e.target.value,
            isLoadModelButtonDisabled: e.target.value?false:true
        });
    }

    plotData = () => {
        tfvis.visor().open();
        plot(this.props.data, "Square Feet");  
        this.setState({ isDataPlotted: true });      
    }

    splitData = async () => {
        // const [X_train, y_train, X_test, y_test] = await splitTrainTestData(this.props.data[0]);
        const [X_min, X_max, y_min, y_max, X_train, y_train, X_test, y_test] = await splitTrainTestData(this.props.data[0]);
        
        this.setState({
            isDataSplit: true,
            X_min: X_min,
            X_max: X_max,
            y_min: y_min,
            y_max: y_max,
            X_train: X_train,
            y_train: y_train,
            X_test: X_test,
            y_test: y_test
        });
    }

    createModel = () => {
        const model = createModel();
        this.setState({ model: model, isModelCreated: true });
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
            isModelTrained: true, 
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
            isModelSaveable: true,
            isPredictReady: true,
            test_loss: testLoss
        });
    }

    saveModel = async () => {
        console.log(this.saveModelAs.current.value);
        const modelName = this.saveModelAs.current.value?this.saveModelAs.current.value:this.state.modelName;
        console.log(modelName);
        const savedModel = await this.state.model.save(`localstorage://${modelName}`);
        console.log(savedModel.modelArtifactsInfo);

        const dataSetMinMax = {
            Xmin: this.state.X_min,
            Xmax: this.state.X_max,
            ymin: this.state.y_min,
            ymax: this.state.y_max
        }
        
        window.localStorage.setItem(`minmax_${this.state.modelName}`, JSON.stringify(dataSetMinMax));
    }

    loadModel = async () => {
        const storageKey = `localstorage://${this.state.loadModelName}`;
        const models = await tf.io.listModels();
        console.log(models);
        const modelInfo = models[storageKey];

        const {Xmin, Xmax, ymin, ymax} = JSON.parse(window.localStorage.getItem(`minmax_${this.state.loadModelName}`));
        console.log(Xmin, Xmax, ymin, ymax);
        if (modelInfo) {
            const model = await tf.loadLayersModel(storageKey);
            const layer = model.getLayer(undefined, 0);
            this.setState({ 
                model: model,
                isPredictReady: true,
                isLoadModelButtonDisabled: true,
                X_min: Xmin,
                X_max: Xmax,
                y_min: ymin,
                y_max: ymax
            })
        
            tfvis.show.modelSummary({ name: `Model Summary`, tab: `Model` }, model);
            tfvis.show.layer({ name: `Layer 1`, tab: `Model Inspection` }, layer);
            tfvis.visor().open();
        }
    }

    makePrediction = () => {   
        tf.tidy(() => {
            const tensorXmin = tf.tensor1d([this.state.X_min]);
            const tensorXmax = tf.tensor1d([this.state.X_max]);
            const tensorymin = tf.tensor1d([this.state.y_min]);
            const tensorymax = tf.tensor1d([this.state.y_max]);
            const predTensorInput = tf.tensor1d([parseInt(this.userPred.current.value)]);
            const normalizedInputPred = normalizeTensor(predTensorInput, tensorXmin, tensorXmax);
            const normalizedOutputPred = this.state.model.predict(normalizedInputPred.tensor);
            const predTensorOutput = denormalizeTensor(normalizedOutputPred, tensorymin, tensorymax);
            this.setState({ prediction: predTensorOutput.dataSync()[0] });
        })
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
                <button onClick={this.loadData}  className="ui button" disabled={this.state.isLoadDataButtonDisabled}>{this.state.loadDataButtonText}</button>
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
                <button onClick={this.trainModel} className="ui button" disabled={!this.state.isModelCreated}>Train Model</button>
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
                <button onClick={this.testModel} className="ui button" disabled={!this.state.isModelTrained}>Test Model</button>
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
                                <select onChange={this.saveModelName} className="ui dropdown">
                                    <option value="">Load Data</option>
                                    <option value="kc_house_prices">KC Housing Prices</option>
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
                                <button onClick={this.plotData} className="ui button" disabled={!this.state.isDataLoaded}>Plot Data</button>
                            </div>
                            <div className="column"></div> 
                        </div>
                    </div>                                    
                </div>
                <div className="ui one column celled grid">
                    <div className="column">
                        <h3>Split Train Test Data</h3>
                        <button onClick={this.splitData} className="ui button" disabled={!this.state.isDataPlotted}>Split Data</button> &nbsp;
                        <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
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
                                <h4>Epochs</h4>
                                <div className="ui input">
                                    <input type="text" placeholder="Enter # of epocs..." />
                                </div>
                                {/* <h4>Loss Function</h4>
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
                                </div> */}
                            </div>                            
                            <div className="column"></div>
                        </div>
                    </div>
                    <div className="column">
                        <button onClick={this.createModel} className="ui button" disabled={!this.state.isDataSplit}>Create Model</button>
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
                                <div className="ui input">
                                    <input type="text" placeholder="Save model as..." ref={this.saveModelAs} />
                                </div>
                                <br /><br />
                                <select onChange={this.handleLoadModelName} className="ui dropdown">
                                    <option value="">Load Model</option>
                                    <option value="kc_house_prices">KC House Prices</option>
                                </select>                                                         
                            </div>                            
                            <div className="column">
                            <button onClick={this.saveModel} className="ui button" disabled={!this.state.isModelSaveable}>Save Model</button>
                            <br /><br />
                            <button onClick={this.loadModel} className="ui button" disabled={this.state.isLoadModelButtonDisabled}>Load Model</button>
                            </div>  
                            <div className="column">
                                <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
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
                                    <input type="text" placeholder="Enter value..." ref={this.userPred} />
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
                                <button onClick={this.makePrediction} className="ui button" disabled={!this.state.isPredictReady}>Predict</button>                                                              
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