import React from 'react';
import './typeahead.css'

class Typeahead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text:'',
      cursor: 0,
      suggestions: []
    }
  }

  fetchData = async (textSearch) => {
    const apiOpts = {
      method: 'GET',
      headers: new Headers({'Content-Type': 'application/json'})
    }
    const apiUrl = `http://0.0.0.0:80/api/search-autocomplete/?search=${textSearch}`
    const response = await fetch(apiUrl, apiOpts)
    return response
  }
  
  onTextChange = (e) => {
    let suggestions = [];
    const value = e.target.value;
    if (value.length > 0) {
        const response = this.fetchData(value)
        response.then((res => res.json())).then(data => {
            suggestions = data.map(item => item.text2)
            this.setState(() => ({
                suggestions,
                text:value
              }));
        });
    }
  }
  
  hanldeKeydown = (evt) => {
    const cursor = this.state.cursor;
    const suggestions = this.state.suggestions;
    if (evt.keyCode === 38 && cursor > 0) {
      this.setState(prevState => ({
        cursor: prevState.cursor - 1
      }));
    } else if (evt.keyCode === 40 && cursor < suggestions.length - 1) {
      this.setState(prevState => ({
        cursor: prevState.cursor + 1
      }));
    }
    if (evt.keyCode === 13) {
      let currentItem = suggestions[cursor];
      if (currentItem !== undefined) {
        this.setState({ text: currentItem, suggestions: [] });
      }
    }
    if (evt.keyCode === 8 && this.state.text.length == 1) {
        this.setState({ text: '', suggestions: [] });
    }
  }

  hanldeKeyup = (evt) => {
    if (!this.state.text) {
        this.setState({ suggestions: [] });
        return false;
    }
  }
  
  suggestionSelected=(value)=>{
    this.setState(()=>({
      text:value,
      suggestions:[]
    }))
  }
  
  renderSuggestions = () => {
    const { cursor, suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map((text, idx) => (
            <li className={cursor === idx ? "active list-group-item" : "list-group-item"}
                key={text}
                onClick={(e)=>this.suggestionSelected(text)}
                >{text}
            </li>
        ))}
      </ul>
    )
  }

  render() {
    const {text}=this.state;
    return (
      <div className="container">
        <div className="container-box mt-4">
          <div className="form-group typeahead">
            <div className="input-group">
              <span className="input-group-addon">
                <i className="glyphicon glyphicon-map-marker"></i>
              </span>
              <input type="text"
                    id="autocomplete"
                    onChange={this.onTextChange}
                    onKeyDown={this.hanldeKeydown}
                    onKeyUp={this.hanldeKeyup}
                    placeholder="Search destination"
                    value={text}
                    className="custom-input form-control" />
            </div>
            {this.renderSuggestions()}
          </div>
        </div>
      </div>
    );
  }
}

export default Typeahead;
