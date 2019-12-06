import React from 'react';
import { connect } from 'react-redux';
import { getData } from '../actions';
import { plotAndCreateModel } from './tf';

// const tf = require('@tensorflow/tfjs');
const tfvis = require('@tensorflow/tfjs-vis');

class App extends React.Component {
    state = { 
        isLoading: true
    }

    componentDidMount() {
        this.props.getData();
    }

    // componentDidUpdate(object prevProps, object prevState)
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            tfvis.visor().toggle();
            plotAndCreateModel(this.props.data, "Square Feet");
            this.setState({isLoading: false});
        }
    }

    handleTFVIS = () => {
        tfvis.visor().toggle();
    }

    renderLoader = () => {
        if (this.state.isLoading) {
            return (
                <div className="ui segment">
                    <div className="ui active dimmer">
                        <div className="ui text loader">
                            Preparing large dataset. This may take some time.
                        </div>
                    </div>
                    <br /><br />
                </div>
            )
        } else {
            return (
                <div>
                    <button onClick={this.handleTFVIS} className="ui button">Toggle Visor</button>
                </div>
            )
        }
    }

    render () {
        return (
            <div className="ui container">
                <h2>Simple Linear Regression</h2> 
                {this.renderLoader()}                       
            </div>
        )
    }    
}

const mapStateToProps = state => {     
    return { data: state.data }
}

export default connect(mapStateToProps, { getData })(App);