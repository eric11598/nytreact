import React, { Component } from 'react';
import Jumbotron from '../components/Jumbotron';
import API from '../utils/API';
import { Link } from 'react-router-dom';
import { Col, Row, Container } from '../components/Grid';
import { List, ListItem } from '../components/List';
import { Input, TextArea, FormBtn } from '../components/Form';

class Main extends Component {
  state = {
    articles: [],
    topic: '',
    begin: '',
    end: '',
    savedArticles: [],
  };

  componentDidMount() {
    this.loadSavedArticles();
  }



  deleteArticle=id=> {
    API.deleteArticle(id)
      .then(res => this.loadSavedArticles())
      .catch(err => console.log(err));

  };

  getArticles=()=> {
    let query = `${this.state.topic}`;
    if (this.state.begin) 
      query = `${query}&begin_date=${this.state.begin}`;
    
    if (this.state.end) 
      query = `${query}&end_date=${this.state.end}`;
    

    API.nytSearch(query)
      .then(res => {
        console.log(res);
        this.setState({
          articles: res.data.response.docs,
          topic: '',
          begin: '',
          end: ''
        });
      })
      .catch(err => console.log(err));
  };
  loadSavedArticles=()=> {
    API.getSavedArticles()
      .then(res => {console.log(res.data);
        this.setState({savedArticles: res.data})
      })
      .catch(err => {console.log(err);});
  };



  saveArticle = articleInfo => {
    API.saveArticle(articleInfo)
      .then(res => this.loadSavedArticles())
      .catch(err => console.log(err))
  }


  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.topic) {
      this.getArticles();
    }
  };

  render() {
    return (
      <Row>
        <Col size="md-12">
          <Jumbotron>
            <h1>Search for a topic.</h1>
          </Jumbotron>
          <form>
            <Input
              value={this.state.topic}
              onChange={this.handleInputChange}
              name="topic"
              placeholder="Topic"
            />
            <Input
              value={this.state.begin}
              onChange={this.handleInputChange}
              name="begin"
              placeholder="Begin - YYYYMMDD"
            />
            <Input
              value={this.state.end}
              onChange={this.handleInputChange}
              name="end"
              placeholder="End - YYYYMMDD"
            />
            <FormBtn disabled={!this.state.topic} onClick={this.handleFormSubmit}>
              Submit
              </FormBtn>
          </form>
        </Col>
        <Col size="md-12">
          <Jumbotron>
            <h1>Article Results</h1>
          </Jumbotron>
          {this.state.articles.length ? (
            <List>
              {this.state.articles.map(article => (
                <ListItem key={article._id}>
                  <a href={article.web_url} target="_blank">
                    <strong>{article.headline.main}</strong>
                  </a>
                  <br />
                  <span>Published on {article.pub_date}</span>
                  <button className="btn btn-primary" style={{ float: "right" }} onClick={() => this.saveArticle({
                    title: article.headline.main,
                    url: article.web_url,
                    date: article.pub_date
                  })}>Save</button>
                </ListItem>
              ))}
            </List>
          ) : (
              <h3>No Articles</h3>
            )}
        </Col>
    


        <Col size="md-12">
        <Jumbotron>
            <h1>Saved Articles</h1>
          </Jumbotron>

          {this.state.savedArticles.length ? (
            <List>
              {this.state.savedArticles.map(article => (
                <ListItem key={article._id}>
                  <a href={article.url} target="_blank">
                    <strong>{article.title}</strong>
                  </a>
                  <br />
                  <span>Published on {article.date}</span>
                  <button
                    className="btn btn-danger"
                    style={{ float: 'right' }}
                    onClick={() => this.deleteArticle(article._id)}
                  >
                    Delete
          </button>
                </ListItem>
              ))}
            </List>
          ) : (
              <h3>No Saved Articles</h3>
            )}
        </Col>
        </Row>
    );
  }
}

export default Main;
