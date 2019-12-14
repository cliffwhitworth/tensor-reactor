import React from 'react';
import { connect } from 'react-redux';
import { createModelAction, createModelState } from '../actions';
import { openVisor, toggleVisor, createModel } from './tf';

class CreateModel extends React.Component {

    handleTFVIS = () => {
        toggleVisor();
    }

    createModel = async () => {
        this.props.createModelState();        
        const model = await createModel();
        this.props.createModelAction(model);
        openVisor();
    }

    render() {
        return (
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
                        <button onClick={this.createModel} className="ui button" disabled={!this.props.isDataSplit}>Create Model</button>
                        <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                    </div>
                </div>
        )
    }
}

const mapStateToProps = state => {   
    return { 
        isDataSplit: state.store.isDataSplit
    }
}

export default connect(mapStateToProps, { createModelAction, createModelState })(CreateModel);