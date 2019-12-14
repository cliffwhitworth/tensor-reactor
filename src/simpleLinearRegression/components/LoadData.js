import React from 'react';
import { connect } from 'react-redux';
import { loadData, getData } from '../actions';

class LoadData extends React.Component {

    state = {
        isLoadDataButtonDisabled: true, 
        isDataLoaded: false,
        isDataLoading: false,
        loadDataButtonText: 'Load Data',
        modelName: ''
    }

    loadData = async () => {        
        this.setState({ isDataLoading: true });
        await this.props.getData();
        this.props.loadData();
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

    render() {
        return (
            <div className="ui one column celled grid">
                <div className="column" style={{paddingBottom: "13px"}}>
                    <h3>Load Data</h3>                         
                    <select onChange={this.saveModelName} className="ui dropdown">
                        <option value="">Load Data</option>
                        <option value="kc_house_prices">KC Housing Prices</option>
                    </select> &nbsp;
                    {this.renderLoadDataButton()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {   
    return { 
        data: state.data
    }
}

export default connect(mapStateToProps, { loadData, getData })(LoadData);