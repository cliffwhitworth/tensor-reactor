import React from 'react';
import { connect } from 'react-redux';
import { listRoute } from '../../actions'

class ReadRoute extends React.Component {
  componentDidMount() {
    this.props.listRoute();
  }

  render() {
    if(!this.props.resource) {
      return <div>Loading...</div>
    }
    return (
      <div className="ui container">
        <h3>Read Resource: {this.props.resource.title}</h3>
        <div className="ui header">
          {this.props.resource.title}
        </div>
        <div className="ui content">
          {this.props.resource.description}
        </div>        
      </div>
    )
  }  
}

const mapStateToProps = (state, ownProps) => {
  return { resource: state.routes[ownProps.match.params.id] }
}

export default connect(mapStateToProps, { listRoute })(ReadRoute);