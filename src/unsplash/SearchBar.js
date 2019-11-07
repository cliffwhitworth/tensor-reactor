import React from 'react';

class SearchBar extends React.Component {
    state = {term: ''};

    onFormSubmit = event => {
        event.preventDefault();
        this.props.onSubmit(this.state.term);
    }

    render() {
        return (
            <div className="ui segment">
                <form onSubmit={this.onFormSubmit} className="ui form">
                    <div className="ui action left icon fluid input">
                        <i className="search icon" />
                        <input
                        placeholder="Search..."
                        type="text"
                        value={this.state.term}
                        onChange={e => this.setState({ term: e.target.value })}
                        />
                        <div 
                        className="ui button"
                        onClick={this.onFormSubmit}
                        >Search</div>
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;