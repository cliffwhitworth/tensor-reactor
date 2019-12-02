import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../Modal';

import { readRoute, deleteRoute } from '../../actions';
import history from '../../history';

class DeleteRoute extends React.Component {
  componentDidMount() {
    this.props.readRoute(this.props.match.params.id);
  }

  renderContent = () => {
    if(!this.props.resource) {
      return 'Are you sure you want to delete?'
    }
    return `Are you sure you want to delete ${this.props.resource.title}?`
  }

  renderActions = () => {
    // const id = this.props.match.params.id;
    const { id } = this.props.match.params;

    return (
      <React.Fragment>
        <button onClick={() => this.props.deleteRoute(id)} className="ui button negative">Delete</button>
        <Link to="/" className="ui button">Cancel</Link>
      </React.Fragment>
    )
  }  

  render () {
    return (
      <Modal 
        title="Delete Resource"
        content={this.renderContent()}
        actions={this.renderActions()}
        onDismiss={() => history.push('/')}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { resource: state.routes[ownProps.match.params.id] }
}

export default connect(mapStateToProps, { readRoute, deleteRoute })(DeleteRoute);