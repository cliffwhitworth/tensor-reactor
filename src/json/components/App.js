import React from 'react';
import PostList from './PostsList';

class App extends React.Component {
    render() {
        return (
            <div className="ui container" style={{marginTop: "23px"}}>
                <h2>JSON Placeholder App</h2>
                <PostList />
            </div>
        )
    }
}

export default App;