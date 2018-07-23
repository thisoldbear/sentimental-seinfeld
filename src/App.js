import React, { Component } from 'react';
import axios from 'axios';

import { AZURE_API_KEY } from './config';

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
      <div className="app">
        <div className="logo">
          <span className="logo__sent">Sentimental</span>
          <span className="logo__sein">
            Se<span className="logo__i">1</span>nfeld
          </span>
        </div>
        <div className="quote">
          {this.state.score ? (
              <React.Fragment>
                <p><span className="quote__mark">"</span><em>{this.state.quote}</em><span className="quote__mark">"</span></p>
                <p><strong>{this.state.author}</strong></p>
                <p>Sentiment: <strong>{this.state.score} / 100</strong></p>
              </React.Fragment>
            ) : (
              <p>Fetching and analysing a quote...</p>
            )}
          </div>
          <div className="footer">
            <p>Quotes from the <a href="https://seinfeld-quotes.herokuapp.com/">Seinfeld Quotes API</a></p>
            <p>Sentiment score from <a href="https://docs.microsoft.com/en-gb/azure/cognitive-services/text-analytics/">Azure Cognitive Services Text Analytics</a></p>
            <p>View on <a href="https://github.com/thisoldbear/sentimental-seinfeld">Github</a></p>
          </div>
      </div>
    );
  }
}

export default App;
