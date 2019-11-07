import React from 'react';
import api from './API';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

class App extends React.Component {
    state = { images: []};

    onSearchSubmit = async term => {
        const response = await api.get('/search/photos', {
            params: {
                query: term
            }
        });
        this.setState({ images: response.data.results })
    }

    render() {
        return (
            <div className="ui container" style={{marginTop: "10px", width: "80%"}}>
                <h2 className="ui center aligned header">Unsplash Photo Search</h2>
                <SearchBar onSubmit={this.onSearchSubmit} />
                Found: {this.state.images.length} images (default return limit: 10)
                <ImageList images={this.state.images} />
            </div>
        );
    }
}

export default App;