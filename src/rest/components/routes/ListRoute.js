import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { listRoute } from '../../actions';

class ListRoute extends React.Component {
  componentDidMount() {
    this.props.listRoute();
  }

  renderList = () => {
    return this.props.resources.map(resource => {
      return (
        <div className="item" key={resource.id}>
          {this.renderOwner(resource.id)}
          <i className="large middle aligned icon file outline" />
          <div className="content">
            <Link to={`/route/read/${resource.id}`} className="header">
              {resource.title}
            </Link>
            <div className="description">{resource.description}</div>
          </div>
        </div>
      )
    });
  }

  renderCreateButton = () => {
    if (this.props.isSignedIn) {
      return (
        <div style={{textAlign: "right"}}>
          <Link className="ui button primary" to="/route/post">
            Create New Resource
          </Link>
        </div>
      )
    }
  }

  renderOwner = id => {
    if (this.props.isSignedIn) {
      return (
        <div className="right floated content">
          <Link className="ui button green" to={`/route/patch/${id}`}>
            Edit
          </Link>
          <Link className="ui button negative" to={`/route/delete/${id}`}>
            Delete
          </Link>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <h3>List of Resources</h3>
        <div className="ui celled list">
          {this.renderList()}
        </div>
        {this.renderCreateButton()}               
      </div>
    );
  }  
}

const mapStateToProps = state => {
  return { 
    resources: Object.values(state.routes),
    isSignedIn: state.auth.isSignedIn
  };
}

export default connect(mapStateToProps, { listRoute })(ListRoute);
