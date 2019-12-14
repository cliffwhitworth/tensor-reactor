import React from 'react';
import { connect } from 'react-redux';
import { plotData } from '../actions';
import { openVisor, plot } from './tf';

class PlotData extends React.Component {

    plotData = () => {        
        plot(this.props.data, "Square Feet");  
        this.props.plotData();
        openVisor();   
    }

    render() {
        return (
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
        )
    }
}

const mapStateToProps = state => {   
    return { 
        data: state.store.data,
        isDataLoaded: state.store.isDataLoaded
    }
}

export default connect(mapStateToProps, { plotData })(PlotData);