import React from 'react';
import { connect } from 'react-redux';
import { getData, dispatchModel, createPredictReadyState, fillMinMaxObject } from '../actions';
import { openVisor, toggleVisor, loadSavedModel, doesModelExist, testLoadedModel, loadModelNames } from './tf';

class ManageModel extends React.Component {

    constructor(props) {
        super(props)        
        this.saveModelAs = React.createRef();      
    }

    componentDidMount() {
        this.getModelNames();
    }

    state = { 
            isLoadModelDataLoading: false,
            loadModelButtonText: 'Load Model',
            isLoadModelButtonDisabled: true,
            dateModelSaved: '',
            modelNames: {}
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
        const savedModel = await this.props.model.save(`localstorage://${modelName}`);
        console.log(savedModel.modelArtifactsInfo);
        this.setState({
            dateModelSaved: `Model Saved: ${savedModel.modelArtifactsInfo.dateSaved}`
        });
        const modelMetaData = JSON.parse(window.localStorage.getItem(`tensorflowjs_models/${modelName}/model_metadata`));
        modelMetaData['minMaxValues'] = this.props.minMaxValues;
        window.localStorage.setItem(`tensorflowjs_models/${modelName}/model_metadata`, JSON.stringify(modelMetaData));
    }

    testModel = async () => {
        const model = await testLoadedModel(this.state.loadModelName);
        const savedModel = await model.save(`localstorage://${this.state.loadModelName}`);
        console.log(savedModel.modelArtifactsInfo.dateSaved);
        this.setState({
            dateModelSaved: `Model Saved: ${savedModel.modelArtifactsInfo.dateSaved}`
        })
        // const modelMetaData = JSON.parse(window.localStorage.getItem('tensorflowjs_models/kc_house_prices/model_metadata'));
        // console.log(modelMetaData);
        // modelMetaData['misc'] = {'name': 'hello world'};
        // window.localStorage.setItem('tensorflowjs_models/kc_house_prices/model_metadata', JSON.stringify(modelMetaData));            
        // console.log(savedModel);
        // const miscInfo = JSON.parse(window.localStorage.getItem('tensorflowjs_models/kc_house_prices/model_metadata'));
        // console.log(miscInfo);
        // console.log(miscInfo.misc);

    }

    loadModel = async () => {
        this.setState({isLoadModelDataLoading: true});                 
        if (doesModelExist(this.state.loadModelName)) {           
            const modelMetaData = JSON.parse(window.localStorage.getItem(`tensorflowjs_models/${this.state.loadModelName}/model_metadata`));
            const minMaxValues = modelMetaData.minMaxValues;
            await this.props.getData();
            this.props.createPredictReadyState();
            this.props.fillMinMaxObject(minMaxValues);
            const model = await loadSavedModel(this.state.loadModelName, this.props.data, minMaxValues);
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

    getModelNames = async () => {
        const models = await loadModelNames();
        this.setState({ modelNames: models });
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
        let optionItems = '';
        if(Object.keys(this.state.modelNames)) {
            let names = this.state.modelNames;
            optionItems = Object.keys(names).map((name) =>
                <option key={name.replace('localstorage://', '')}>{name.replace('localstorage://', '')}</option>
            );
        }        

        return (
            <div className="ui one column celled grid">
                <div className="column" style={{paddingBottom: "13px"}}>
                    <h3>Manage Model</h3> 
                    <div className="ui input">
                        <input type="text" placeholder="Save model as..." ref={this.saveModelAs} />
                    </div> &nbsp;
                    <button onClick={this.saveModel} className="ui button" disabled={!this.props.isModelSaveable}>Save Model</button>
                    <br />{this.state.dateModelSaved}
                    <br /><br />
                    <select onChange={this.handleLoadModelName} className="ui dropdown">
                        <option value="">Load Model</option>
                        {optionItems}
                    </select> &nbsp;
                    {this.renderLoadModelButton()} 
                    <br /><br />
                    <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                    {/* <br /><br />
                    <button onClick={this.testModel} className="ui button">test</button> */}
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