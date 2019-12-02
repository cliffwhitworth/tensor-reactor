// https://redux-form.com/8.2.2/
import React from 'react';

import { connect } from 'react-redux';
import { postRoute } from '../../actions';
import FormHelper from './FormHelper';

class PostRoute extends React.Component {
  onSubmit = formValues => {
    this.props.postRoute(formValues);
  };

  render() {
    return (
      <div className="ui container">
        <h3>Create Resource</h3>        
        <FormHelper 
          submitText="Submit"
          onSubmit={this.onSubmit} 
        />
      </div>
    );
  }
}

export default connect(
  null,
  { postRoute }
)(PostRoute);
