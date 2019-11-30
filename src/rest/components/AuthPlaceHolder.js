import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

class AuthPlaceHolder extends React.Component {

    renderAuthButton() {
        if (this.props.isSignedIn) {
            return (
                <button onClick={this.props.signOut} className="ui red button">
                    <i className="sign out alternate icon" />
                    Sign Out
                </button>
            )
        } else {
            return (
                <button onClick={this.props.signIn} className="ui green button">
                    <i className="sign in alternate icon" />
                    Sign In
                </button>
            )
        }
    }

    render() {
        return <div>{this.renderAuthButton()}</div>
    }    
}

const mapStateToProps = state => {
    return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(AuthPlaceHolder);