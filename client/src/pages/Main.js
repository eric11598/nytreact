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
    queryTerm: '',
    beginDate: '',
    endDate: '',
    savedArticles: [],
  };

  componentDidMount() {
    this.loadSavedArticles();
  }

  loadSavedArticles = () => {
    API.getSavedArticles()
      .then(res => {
        console.log(res.data);
        this.setState({
          savedArticles: res.data
        })
      })
      .catch(err => {
        console.log(err);
      });
  };

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadSavedArticles())
      .catch(err => console.log(err));

  };

  getArticles = () => {
    let query = `${this.state.queryTerm}`;
    if (this.state.beginDate) {
      query = `${query}&begin_date=${this.state.beginDate}`;
    }
    if (this.state.endDate) {
      query = `${query}&end_date=${this.state.endDate}`;
    }

    API.nytSearch(query)
      .then(res => {
        console.log(res);
        this.setState({
          articles: res.data.response.docs,
          queryTerm: '',
          beginDate: '',
          endDate: ''
        });
      })
      .catch(err => console.log(err));
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
    if (this.state.queryTerm) {
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
              value={this.state.queryTerm}
              onChange={this.handleInputChange}
              name="queryTerm"
              placeholder="Topic (required)"
            />
            <Input
              value={this.state.beginDate}
              onChange={this.handleInputChange}
              name="beginDate"
              placeholder="Begin (YYYYMMDD - optional)"
            />
            <Input
              value={this.state.endDate}
              onChange={this.handleInputChange}
              name="endDate"
              placeholder="End (YYYYMMDD - optional)"
            />
            <FormBtn disabled={!this.state.queryTerm} onClick={this.handleFormSubmit}>
              Submit Search
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
                  })}> Save Article </button>
                </ListItem>
              ))}
            </List>
          ) : (
              <h3>No Results to Display</h3>
            )}
        </Col>
    


        <Col size="md-12">
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
                    Delete Article
          </button>
                </ListItem>
              ))}
            </List>
          ) : (
              <h3>No Saved Articles to Display</h3>
            )}
        </Col>
        </Row>
    );
  }
}

export default Main;
