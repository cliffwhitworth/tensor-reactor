import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { listRoute, patchRoute } from '../../actions'

import FormHelper from './FormHelper';

class PutRoute extends React.Component {
  componentDidMount() {
    this.props.listRoute();
  }

  onSubmit = formValues => {
    this.props.patchRoute(this.props.match.params.id, formValues);
  };

  render() {
    if (!this.props.resource) {
      return <div>Loading...</div>
    }
    return (      
      <div className="ui container">
        <h3>Edit Resource: {this.props.resource.title}</h3>
        <FormHelper
          submitText = "Update"
          initialValues={_.pick(this.props.resource, 'title', 'description')}
          onSubmit={this.onSubmit} />
      </div>)
  }  
}

const mapStateToProps = (state, ownProps) => {
  return { resource: state.routes[ownProps.match.params.id] }
}

export default connect(mapStateToProps, { listRoute, patchRoute })(PutRoute);