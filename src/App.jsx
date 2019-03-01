import React, { Component } from 'react';

const GIT_BASE_API_URL = "https://api.github.com/users/";
const GIT_REQUEST_APPENDER = "/repos";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      search_user: '',
      search_repo_key: '',
      user_result: [],
      user_repo_result: []
    }

    this._renderResult = this._renderResult.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this._makeRequest = this._makeRequest.bind(this);
    this._clearRepo = this._clearRepo.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this._clearResult = this._clearResult.bind(this);
  }



  _makeRequest() {

    const REQ_URL = GIT_BASE_API_URL + String(this.state.search_user) + GIT_REQUEST_APPENDER;

    fetch(REQ_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(respo => respo.json())
      .then(respJson => {
        this.setState({
          user_result: respJson,
          user_repo_result: respJson
        })
      })
      .catch(err => {
        alert('Unable to search' + '\n' + err);

      })

  }

  _clearRepo() {
    this.setState({
      user_result: [],
      user_repo_result: [],
      search_user: '',
      search_repo_key: '',
    })
  }

  _clearResult() {
    this.setState({
      search_repo_key: '',
      user_repo_result: this.state.user_result,
    })
  }

  handleFilter(e) {

    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      const allRepos = this.state.user_result;
      const filteredRepos = allRepos.filter((item) =>
        String(item.name).includes(String(this.state.search_repo_key))
      )

      this.setState({
        user_repo_result: filteredRepos
      })
    })
  }



  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  _renderResult() {
    return this.state.user_repo_result.map((repo, index) => {
      return (
        <div className="resultItemContainer" key={index}>
          {highlightText(repo.name, this.state.search_repo_key)}
        </div>
      )
    })
  }




  render() {
    return (
      <div className="container">
        <div className="gitApp">

          <div className="searchbar">
            <input type="text" value={this.state.search_user} name="search_user" onChange={this.handleInput} />
            <button onClick={this._makeRequest} id="mainSearchBtn">Go</button>
            <button onClick={this._clearRepo} id="mainClearBtn" disabled={this.state.user_result.length > 0 ? true : false}>Clear</button>
          </div>

          <div className="filterbar">
            <input type="text" value={this.state.search_repo_key} name="search_repo_key" onChange={this.handleFilter} placeholder="Enter some keywords" />
            <button onClick={this._clearResult} id="resultClearBtn" disabled={this.state.user_repo_result.length > 0 ? false : true}>Clear</button>
          </div>

          <div className="searchResult">
            <div className="resultPanel">
              {
                this._renderResult()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function highlightText(text, keyword) {
  let tokens = text.split(new RegExp(`(${keyword})`, 'gi'));
  return <span className="resultItem"> {tokens.map((char, i) =>
    <span key={i} className={char.toUpperCase() === keyword.toUpperCase() ? 'highlightedText' : null}>
      {char}
    </span>)
  } </span>;
}

export default App;

