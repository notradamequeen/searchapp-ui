import React from 'react';
import './App.css';
import Typeahead from './components/typeahead/typeahead';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <h1 className="title-heading"> Wisatabook Coding Tests (Febby) - Autocomplete search box</h1>
        <Typeahead />
      </div>
    );
  }
}

export default App;
