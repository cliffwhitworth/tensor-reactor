import React from 'react';
import { connect } from 'react-redux';
import { makeModelPrediction } from './tf';

class MakePrediction extends React.Component {

    constructor(props) {
        super(props)
        this.userPred = React.createRef();       
    }

    state = { prediction: '' }

    clearInput = e => {
        e.target.value = '';
    }

    makePrediction = async () => {  
        if (this.userPred.current.value < 800 || this.userPred.current.value > 16000) {
            this.userPred.current.value = 'Invalid Square Footage';
            return true;
        } 
        const {X_min, X_max, y_min, y_max} = this.props.minMaxValues;
        const prediction = await makeModelPrediction(this.props.model, this.userPred.current.value, X_min, X_max, y_min, y_max);
        this.setState({ prediction: prediction });       
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

    render () {
        return (
            <div className="ui one column celled grid">
                <div className="column" style={{paddingBottom: "13px"}}>
                    <h3>Make Prediction</h3>
                    Enter square footage between 800 and 16000
                    <br />
                    <div className="ui input">
                        <input onFocus={this.clearInput} type="text" placeholder="Enter sq footage..." ref={this.userPred} />
                    </div> &nbsp;
                    <button onClick={this.makePrediction} className="ui button" disabled={!this.props.isPredictReady}>Predict</button>
                    <br /><br />
                    <div className="ui labeled input">
                        <div className="ui label">
                            Predicted Value
                        </div>
                        <input type="text" placeholder="predicted value" value={this.renderPredictionValue()} readOnly />
                    </div>
                </div>                                    
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        model: state.store.model,
        isPredictReady: state.store.isPredictReady,
        minMaxValues: state.store.minMaxValues
    }
}

export default connect(mapStateToProps)(MakePrediction);