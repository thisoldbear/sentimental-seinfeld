import React, { Component } from 'react';
import axios from 'axios';

import { AZURE_API_KEY } from './config';

import './App.css';

class App extends Component {
  state = {
    author: null,
    quote: null,
    score: null,
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  componentDidMount() {
    axios.get('https://seinfeld-quotes.herokuapp.com/quotes')
      .then(({data}) => {
        const randomQuote = data.quotes[this.getRandomInt(100)];

        const {
          quote,
          author
        } = randomQuote;

        this.setState({
          quote,
          author,
        });

        return randomQuote;
      })
      .then(({quote}) => {
        const documents = { 'documents': [
          { 'id': '1', 'language': 'en', 'text': quote }
        ]}

        axios({
          method: 'post',
          url: 'https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
          data: documents,
          headers: {'Ocp-Apim-Subscription-Key' : AZURE_API_KEY},
        }).then(response => {
          this.setState({
            score: Math.round(response.data.documents[0].score * 100),
          });
        })
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Sentimental Seinfeld</h1>
        <p>{this.state.quote}</p>
        <p><em>{this.state.author}</em></p>
        <p>Score: {this.state.score} / 100 </p>
      </div>
    );
  }
}

export default App;
