import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { listRoute } from '../../actions';

class ListRoute extends React.Component {
  componentDidMount() {
    this.props.listRoute();
  }

  renderList() {
    return this.props.resources.map(resource => {
      return (
        <Link className="item" key={resource.id} to={`/route/read/${resource.id}`}>
        <div className="right floated content">
          {this.renderOwner(resource.id)}  
          </div>
          <i className="large middle aligned icon file outline" />
            <div className="content">
              <strong>Title:</strong> {resource.title}
              <div className="description"><strong>Description:</strong> {resource.title}</div>
            </div>
        </Link>
      )
    })
  }

  renderCreateButton() {
    if (this.props.isSignedIn) {
      return (
          <Link className="ui button primary" to="/route/post">
            Create New Resource
          </Link>
      )
    }
  }

  renderOwner(id) {
    if (this.props.isSignedIn) {
      return (
        <div>
          <Link className="ui button green" to={`/route/put/${id}`}>
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
      <div className="ui container">
        <h3>List of Resources</h3>
        <div className="ui celled list">
          {this.renderList()}
        </div>
        <div className="ui celled list" style={{textAlign: "right"}}>
          {this.renderCreateButton()}<br /> 
          (Start json-server)
        </div>               
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
