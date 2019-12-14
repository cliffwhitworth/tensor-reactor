import React from 'react';
import { connect } from 'react-redux';
import { getData } from '../actions';
import { openVisor, closeVisor, toggleVisor, plot, createModel, splitTrainTestData, trainModel, createTrendLine, loadSavedModel, makeModelPrediction } from './tf';

import LoadData from './LoadData';

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
        splitDataButtonText: 'Split Data', 
        loadModelButtonText: 'Load Model',      
        train_loss: '',
        val_loss: '',
        test_loss: '',
        metric: '',
        prediction: ''
    }

    componentDidMount() {
        this.initState();
        openVisor();
    }

    // componentDidUpdate(object prevProps, object prevState)
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('hello update');            
        }
    }

    initState = () => {
        this.setState({ 
            isDataLoading: false,
            isLoadDataButtonDisabled: true, 
            isLoadModelButtonDisabled: true,
            isLoadModelDataLoading: false,       
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
            splitDataButtonText: 'Split Data',
            loadModelButtonText: 'Load Model',
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
        toggleVisor();
    }

    loadData = async () => {        
        this.setState({ isDataLoading: true });
        await this.props.getData();
        this.setState({
            loadDataButtonText: 'Data Loaded',
            isDataLoaded: true,
            isDataLoading: false
        });
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
        plot(this.props.data, "Square Feet");  
        this.setState({ isDataPlotted: true });
        openVisor();   
    }

    splitData = async () => {
        // const [X_train, y_train, X_test, y_test] = await splitTrainTestData(this.props.data[0]);
        const [X_min, X_max, y_min, y_max, X_train, y_train, X_test, y_test] = await splitTrainTestData(this.props.data[0]);
        
        this.setState({
            isDataSplit: true,
            splitDataButtonText: 'Data Split',
            X_min: X_min,
            X_max: X_max,
            y_min: y_min,
            y_max: y_max,
            X_train: X_train,
            y_train: y_train,
            X_test: X_test,
            y_test: y_test
        });

        // tfvis.visor().close();
        closeVisor();
    }

    createModel = () => {
        const model = createModel();
        this.setState({ model: model, isModelCreated: true });
        openVisor();
    }

    trainModel = async () => {
        openVisor();
        this.setState({ isModelTraining: true })
        const { model, X_train, y_train, X_min, X_max, y_min, y_max } = this.state;

        const result = await trainModel(model, X_train, y_train, this.props.data[0], X_min, X_max, y_min, y_max);
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
        this.setState({isLoadModelDataLoading: true});
        await this.props.getData();
        const model = await loadSavedModel(this.state.loadModelName, this.props.data[0]);       
        if (model) {   
            const {Xmin, Xmax, ymin, ymax} = JSON.parse(window.localStorage.getItem(`minmax_${this.state.loadModelName}`));
            this.setState({ 
                model: model,
                isPredictReady: true,
                isLoadModelButtonDisabled: true, 
                isLoadModelDataLoading: false,             
                X_min: Xmin,
                X_max: Xmax,
                y_min: ymin,
                y_max: ymax
            });  
            openVisor();
        } else {
            this.setState({ 
                loadModelButtonText: 'Model Not Found',
                isLoadModelDataLoading: false 
            })
        }
    }

    makePrediction = async () => {  
        if (this.userPred.current.value < 800 || this.userPred.current.value > 16000) {
            this.userPred.current.value = 'Invalid Square Footage';
            return true;
        } 
        const {model, X_min, X_max, y_min, y_max} = this.state;
        const prediction = await makeModelPrediction(model, this.userPred.current.value, X_min, X_max, y_min, y_max);
        this.setState({ prediction: prediction });       
    }

    clearInput = e => {
        e.target.value = '';
    }

    plotTrendLine = async () => {
        const {X_min, X_max, y_min, y_max} = this.state;
        await createTrendLine(this.state.model, this.props.data[0], X_min, X_max, y_min, y_max);
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

    renderLoadModelButton = () => {
        if (this.state.isLoadModelDataLoading) {
            return (
                <button className="ui loading button">Loading</button>
            )
        } else {
            return (
                <button onClick={this.loadModel} className="ui button" disabled={this.state.isLoadModelButtonDisabled}>{this.state.loadModelButtonText}</button>
            )
        }
    }

    renderPredictionValue = () => {
        if (this.state.prediction) {
            return `$${this.state.prediction
                .toFixed()
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
        } else {
            return `$0`;
        }    
    }

    // validateS

    render () {
        // console.log(this.props);
        return (
            <div className="ui container">
                <h2>Simple Linear Regression</h2> 
                {/* {this.renderLoader()} 
                <br /><br /> */}
                <div>                     
                    <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>                   
                </div>
                <br /><br />
                <LoadData />
                {/* <div className="ui one column celled grid">
                    <div className="column" style={{paddingBottom: "13px"}}>
                        <h3>Load Data</h3>                         
                        <select onChange={this.saveModelName} className="ui dropdown">
                            <option value="">Load Data</option>
                            <option value="kc_house_prices">KC Housing Prices</option>
                        </select> &nbsp;
                        {this.renderLoadDataButton()}
                    </div>
                </div> */}
                <div className="ui one column celled grid">
                    <div className="column" style={{paddingBottom: "13px"}}>
                        <h3>Plot Data</h3>                        
                        <select className="ui dropdown">
                        <option value="">Plot</option>
                        <option value="1">Scatterplot</option>
                        </select> &nbsp;
                        <button onClick={this.plotData} className="ui button" disabled={!this.props.isDataLoaded}>Plot Data</button>
                    </div>                                    
                </div>
                <div className="ui one column celled grid">
                    <div className="column">
                        <h3>Split Train Test Data</h3>
                        <button onClick={this.splitData} className="ui button" disabled={!this.state.isDataPlotted}>{this.state.splitDataButtonText}</button> &nbsp;
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
                <div className="ui one column celled grid">
                    <div className="column" style={{paddingBottom: "13px"}}>
                        <h3>Model Management</h3> 
                        <div className="ui input">
                            <input type="text" placeholder="Save model as..." ref={this.saveModelAs} />
                        </div> &nbsp;
                        <button onClick={this.saveModel} className="ui button" disabled={!this.state.isModelSaveable}>Save Model</button>
                        <br /><br />
                        <select onChange={this.handleLoadModelName} className="ui dropdown">
                            <option value="">Load Model</option>
                            <option value="kc_house_prices">KC House Prices</option>
                        </select> &nbsp;
                        {this.renderLoadModelButton()} 
                        <br /><br />
                        <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>                                                       
                    </div>
                </div>    
                <div className="ui one column celled grid">
                    <div className="column" style={{paddingBottom: "13px"}}>
                        <h3>Make Prediction</h3>
                        Enter square footage between 800 and 16000
                        <br />
                        <div className="ui input">
                            <input onFocus={this.clearInput} type="text" placeholder="Enter sq footage..." ref={this.userPred} />
                        </div> &nbsp;
                        <button onClick={this.makePrediction} className="ui button" disabled={!this.state.isPredictReady}>Predict</button>
                        <br /><br />
                        <div className="ui labeled input">
                            <div className="ui label">
                                Predicted Value
                            </div>
                            <input type="text" placeholder="predicted value" value={this.renderPredictionValue()} readOnly />
                        </div>
                    </div>                                    
                </div>                     
            </div>
        )
    }    
}

const mapStateToProps = state => {  
    // console.log(state);   
    return { 
        data: state.store.data,
        isDataLoaded: state.store.isDataLoaded
     }
}

export default connect(mapStateToProps, { getData })(App);