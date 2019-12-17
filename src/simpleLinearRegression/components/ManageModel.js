import React from 'react';
import { connect } from 'react-redux';
import { getData, dispatchModel, createPredictReadyState, fillMinMaxObject } from '../actions';
import { openVisor, toggleVisor, loadSavedModel, doesModelExist  } from './tf';

class ManageModel extends React.Component {

    constructor(props) {
        super(props)        
        this.saveModelAs = React.createRef();      
    }

    state = { 
            isLoadModelDataLoading: false,
            loadModelButtonText: 'Load Model',
            isLoadModelButtonDisabled: true
        }

    handleTFVIS = () => {
        toggleVisor();
    }

    handleLoadModelName = e => {
        this.setState({ 
            loadModelName: e.target.value,
            isLoadModelButtonDisabled: e.target.value?false:true
        });
    }

    saveModel = async () => {
        console.log(this.saveModelAs.current.value);
        const modelName = this.saveModelAs.current.value?this.saveModelAs.current.value:this.props.modelName;
        console.log(modelName);
        const savedModel = await this.props.model.save(`localstorage://${modelName}`);
        console.log(savedModel.modelArtifactsInfo);
        
        window.localStorage.setItem(`minmax_${modelName}`, JSON.stringify(this.props.minMaxValues));
    }

    loadModel = async () => {
        this.setState({isLoadModelDataLoading: true});                 
        if (doesModelExist(this.state.loadModelName)) {   
            await this.props.getData();
            const {X_min, X_max, y_min, y_max} = JSON.parse(window.localStorage.getItem(`minmax_${this.state.loadModelName}`));            
            this.props.createPredictReadyState();
            const minMaxValues = { 'X_min': X_min, 'X_max': X_max, 'y_min': y_min, 'y_max': y_max };
            this.props.fillMinMaxObject(minMaxValues);
            const model = await loadSavedModel(this.state.loadModelName, this.props.data);
            this.props.dispatchModel(model);
            this.setState({                 
                isLoadModelButtonDisabled: true, 
                isLoadModelDataLoading: false, 
                loadModelButtonText: 'Model Loaded'
            });  
            openVisor();
        } else {
            this.setState({ 
                loadModelButtonText: 'Model Not Found',
                isLoadModelDataLoading: false 
            })
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

    render() {
        return (
            <div className="ui one column celled grid">
                <div className="column" style={{paddingBottom: "13px"}}>
                    <h3>Manage Model</h3> 
                    <div className="ui input">
                        <input type="text" placeholder="Save model as..." ref={this.saveModelAs} />
                    </div> &nbsp;
                    <button onClick={this.saveModel} className="ui button" disabled={!this.props.isModelSaveable}>Save Model</button>
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
        )
    }
}

const mapStateToProps = state => {
    return {
        model: state.store.model,
        modelName: state.store.modelName,
        data: state.store.data,
        isModelSaveable: state.store.isModelSaveable,
        minMaxValues: state.store.minMaxValues
    }
}

export default connect(mapStateToProps, { getData, dispatchModel, createPredictReadyState, fillMinMaxObject })(ManageModel);