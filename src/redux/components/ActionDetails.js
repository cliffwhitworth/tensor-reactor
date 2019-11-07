import React from 'react';
import { connect } from 'react-redux';

const ActionDetails = ({ action }) => {
    if (!action) {
        return <div><h3>Action Detail</h3></div>
    }
    return (
        <div>
            <h3>Action Detail</h3>
            <p><strong>{action.name}</strong>: {action.example}</p>
        </div>
    )
}

const mapStateToProps = state => {
    return { action: state.selectedAction }
}

export default connect(mapStateToProps)(ActionDetails);