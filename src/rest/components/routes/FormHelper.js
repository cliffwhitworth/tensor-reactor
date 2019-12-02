import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

class FormHelper extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  }

  renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  renderSubmitButton = () => {
    if(this.props.isSignedIn) {
      return (
        <button className="ui button primary">{this.props.submitText}</button>
      )
    }
  }

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
        className="ui form error"
      >
        <Field name="title" component={this.renderInput} label="Enter Title" />
        <Field
          name="description"
          component={this.renderInput}
          label="Enter Description"
        />
        {this.renderSubmitButton()}
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.title) {
    errors.title = 'You must enter a title';
  }

  if (!formValues.description) {
    errors.description = 'You must enter a description';
  }

  return errors;
};

const mapStateToProps = state => {
  return {isSignedIn: state.auth.isSignedIn}
}

const rForm = reduxForm({
  form: 'FormHelper',
  validate
})(FormHelper);

export default connect(mapStateToProps)(rForm);
