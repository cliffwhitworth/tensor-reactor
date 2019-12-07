import React from 'react';
import { connect } from 'react-redux';
import { getData } from '../actions';
import { plot, createModel, splitTrainTestData } from './tf';

// const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');

class App extends React.Component {
    state = { 
        isLoading: false,
        loadingMsg: '',
        X_train: [],
        y_train: [],
        X_test: [],
        y_test: []
    }

    componentDidMount() {
        tfvis.visor().close();
    }

    // componentDidUpdate(object prevProps, object prevState)
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log('hello update');
            this.setState({
                isLoading: false
            });
        }
    }

    handleTFVIS = () => {
        tfvis.visor().toggle();
    }

    loadData = () => {        
        this.setState({isLoading: true, loadingMsg: 'Loading data may take some time.'});
        this.props.getData();
    }

    plotData = () => {
        plot(this.props.data, "Square Feet");
        tfvis.visor().open();
    }

    splitData = async () => {
        const [X_train, y_train, X_test, y_test] = await splitTrainTestData(this.props.data[0]);
        this.setState({
            X_train: X_train,
            y_train: y_train,
            X_test: X_test,
            y_test: y_test
        })
    }

    createModel = () => {
        this.model = createModel();
        const layer = this.model.getLayer(undefined, 0);
        
        tfvis.show.modelSummary({ name: `Model Summary`, tab: `Model` }, this.model);
        tfvis.show.layer({ name: `Layer 1`, tab: `Model Inspection` }, layer);
        tfvis.visor().open();
    }

    trainModel = () => {
        this.state.X_train.print();
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

    render () {
        return (
            <div className="ui container">
                <h2>Simple Linear Regression</h2> 
                {this.renderLoader()} 
                <br /><br />
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
                                <button onClick={this.loadData} className="ui button">Load Data</button>
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
                    <div className="column">
                        <div className="column" style={{paddingBottom: "13px"}}>
                            <h3>Train Model</h3> 
                        </div>
                        <div className="ui three column grid">
                            <div className="column">
                                <button onClick={this.trainModel} className="ui button">Train Model</button><br /><br />
                                <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                            </div>
                            <div className="column">
                                <strong>Training Loss</strong><br />
                                <div className="ui transparent input">
                                    <input type="text" placeholder="training loss" />
                                </div>
                            </div>
                            <div className="column">
                                <strong>Validation Loss</strong><br />
                                <div className="ui transparent input">
                                    <input type="text" placeholder="validation loss" />
                                </div>
                            </div>
                        </div>                       
                    </div>
                    <div className="column">                        
                        <div className="column" style={{paddingBottom: "13px"}}>
                            <h3>Test Model</h3>
                        </div>
                        <div className="ui three column grid">
                            <div className="column">
                                <button onClick={this.trainModel} className="ui button">Test Model</button>
                            </div>
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
                                <strong>Testing Loss</strong><br />
                                <div className="ui transparent input">
                                    <input type="text" placeholder="testing loss" />
                                </div>
                            </div>
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
                                    <option value="">Load Model</option>
                                    <option value="1">Model 1</option>
                                </select>
                                <br /><br />
                                <button className="ui button">Load Model</button>
                            </div>                            
                        </div>
                    </div>
                    <div className="column">
                        <div className="column" style={{paddingBottom: "13px"}}>
                            <h3>Prediction</h3>
                        </div>
                        <div className="ui three column grid">
                            <div className="column">
                                <strong>Enter Value</strong><br />
                                <div className="ui input">
                                    <input type="text" placeholder="enter value" />
                                </div>
                                <br /><br />
                                <button className="ui button">Predict</button>
                            </div>
                            <div className="column">
                            <strong>Returned Prediction</strong><br />
                                <div className="ui transparent input">
                                    <input type="text" placeholder="returned prediction" />
                                </div>                                
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