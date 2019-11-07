import React from 'react';
import { connect } from 'react-redux';
import { selectAction } from '../actions';

class ActionList extends React.Component {
    renderActions() {
        return this.props.actions.map((action) => {
            return (
                <div className="item" key={action.name}>
                    <div className="right floated content">
                        <button 
                            className="ui button primary"
                            onClick={() => this.props.selectAction(action)}
                        >Select</button>                        
                    </div>
                    <div className="content">
                        {action.name}
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <div>
                <h3>Actions List</h3>
                <div className="ui divided list">
                    { this.renderActions() }
                </div>
            </div>
            )
    }
}

const mapStateToProps = (state) => { // name is arbitrary
    return {actions: state.actions}
}

// Provider -> App -> Connect -> Children that use store
// export default connect(mapStateToProps, {
//     selectAction: selectAction // calls dispatch via connect
// })(ActionList);
// OR
export default connect(mapStateToProps, { selectAction })(ActionList);