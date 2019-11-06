import React from 'react';
import SeasonDisplay from './SeasonDisplay';
import Spinner from './Spinner';

class ClassComponent extends React.Component {
    // constructor(props) { // optional
    //     super(props);
    //     this.state = {
    //         lat: null,
    //         errorMessage: ''
    //     }        
    // }

    state = {
        lat: null,
        errorMessage: ''
    }

    componentDidMount() {
        window.navigator.geolocation.getCurrentPosition(
            position => this.setState({lat: position.coords.latitude}),
            err => this.setState({errorMessage: err.message})
            // (position) => {
            //     console.log(position)
            //     this.setState({
            //         lat: position.coords.latitude
            //     })
            // },
            // (err) => {
            //     console.log(err)
            //     this.setState({
            //         errorMessage: err.message
            //     })
            // }
        );
    }

    renderContent() {
        if (this.state.errorMessage && !this.state.lat) {
            return <div>Error: {this.state.errorMessage}</div>
        }

        if (!this.state.errorMessage && this.state.lat) {
            return (
                <div>
                    {/* Latitude: {this.state.lat} */}
                    <SeasonDisplay lat={this.state.lat} />
                </div>
            )
        }

        return <div><Spinner message='Please accept location request' /></div>
    }

    render() {
        return (
            // no border red exists
            <div className="border red"> 
                {this.renderContent()}
            </div>
        )
    }
}

// const ClassComponent = () => {
//     window.navigator.geolocation.getCurrentPosition(
//         (position) => console.log(position),
//         (err) => console.log(err)
//     );
//     return (
//         <div>
//             <h2>Class Component App</h2>
//             <SeasonDisplay />
//         </div>        
//     )
// }

/**
 * Lifecycle
 * constructor
 * render
 * componentDidMount
 * componentDidUpdate - rerenders
 * componentWillUnmount
 * Rarely Used
 * shouldComponentUpdate
 * getDerivedStateFromProps
 * getSnapShotBeforeUpdate
 */

export default ClassComponent;