import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import Header from './Header.jsx'
import Content from './Content.jsx'



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentProduct: '',
      productId: '',
      productDesc: '',
      productStyles: '',
      productFeatures: '',
      productRatings: {},
      currentStyle: '',
      styleImages: '',
      currentImg: '',
      imageStyles: {
        defaultView: {
          display: 'block',
          textAlign: 'center',
          maxWidth: '50%',
          maxHeight: '50%',
          width: 'auto',
          height: 'auto',
          marginLeft: '20%',
          borderRadius: '5px',
          cursor: 'zoom-in',
        },
        enlargedView: {
          display: 'block',
          alignSelf: 'center',
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          borderRadius: '5px',
          cursor: 'zoom-out',
        }
      },
      currentImgStyleName: 'defaultView',
      currentImgStyle: '',
      isLoading: true,
      thumbIsLoading: true,
    }
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://52.26.193.201:3000/products/list',
    })
      .then((data) => {
        this.setState({
          products: data.data,
          isLoading: false,
        })
      })
      .then(() => {
        this.setState({
          currentProduct: this.state.products[0],
          productId: this.state.products[0].id,
          productDesc: this.state.products[0].description,
          productFeatures: this.state.products[0].features,
        })
      })
      .then(() => {
        this.grabMyProduct();
        this.getRatings();
      })
      .catch((err) => {
        console.log(err)
      })
  };

  grabMyProduct() {
    axios({
      method: 'get',
      url: `http://52.26.193.201:3000/products/${this.state.productId}/styles`
    })
      .then((data) => {
        this.setState({
          productStyles: data.data.results,
        })
      })
      .then(() => {
        this.setState({
          currentStyle: this.state.productStyles[0],
        })
      })
      .then(() => {
        this.setState({
          styleImages: this.state.currentStyle.photos,
        })
      })
      .then(() => {
        this.setState({
          currentImg: this.state.styleImages[0],
          currentImgStyle: this.state.imageStyles.defaultView,
          thumbIsLoading: false,
        })
      })

  }

  changeView() {
    if (this.state.currentImgStyleName === 'defaultView') {
      this.setState({
        // thumbIsLoading: true,
        currentImgStyle: this.state.imageStyles.enlargedView,
        currentImgStyleName: 'enlargedView',
      })
    }
    if (this.state.currentImgStyleName === 'enlargedView') {
      this.setState({
        thumbIsLoading: false,
        currentImgStyle: this.state.imageStyles.defaultView,
        currentImgStyleName: 'defaultView',
      })
    }
  }

  getRatings() {
    axios({
      method: 'get',
      url: `http://52.26.193.201:3000/reviews/${this.state.productId}/meta`
    })
    .then((data) => {
      this.setState({
        productRatings: data.data.ratings,
      })
    })
  }

  pickImage(index) {
    this.setState({
      currentImg: this.state.styleImages[index],
    })
  }

  render() {
    return (
      <Grid id='layout' container direction='column'>
        <Grid id='header' item xs={12}>
          <Header />
        </Grid>
        <Grid id='announcements'>
          <h3 style={{ textAlign: 'center' }}>Announcements Will Go Here</h3>
        </Grid>
        <Grid id='content' container>
          <Content state={this.state} pickImage={this.pickImage.bind(this)} changeView={this.changeView.bind(this)} />
        </Grid>
      </Grid>
    )
  }
}

export default App;

