import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import Header from './Header.jsx';
import Content from './Content.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentProductIndex: '',
      currentProduct: '',
      productId: '',
      productInfo: '',
      productDesc: '',
      productStyles: '',
      productFeatures: '',
      productRatings: {},
      currentStyle: '',
      currentStyleIndex: '',
      currentStyleImgIndex: '',
      styleImages: '',
      currentImg: '',
      imageStyles: {
        defaultView: {
          display: 'block',
          textAlign: 'center',
          maxWidth: '640px',
          maxHeight: '640px',
          width: '50%',
          height: '100%',
          marginLeft: '5px',
          borderRadius: '5px',
        },
        enlargedView: {
          display: 'inline-block',
          alignSelf: 'center',
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          borderRadius: '5px',
        }
      },
      currentImgStyleName: 'defaultView',
      currentImgStyle: '',
      currentSize: null,
      quantity: '1',
      quantityArray: [1],
      sizeSelected: false,
      openSizeSelector: false,
      isLoading: true,
      thumbIsLoading: true,
    }
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://52.26.193.201:3000/products/list',
      params: {
        page: 1,
        count: 5,
      }
    })
      .then((data) => {
        this.setState({
          products: data.data,
          isLoading: false,
          currentProductIndex: 0,
        })
      })
      .then(() => {
        this.setState({
          currentProduct: this.state.products[this.state.currentProductIndex],
          productId: this.state.products[this.state.currentProductIndex].id,
          productDesc: this.state.products[this.state.currentProductIndex].description,
        })
      })
      .then(() => {
        this.grabMyProduct();
        this.getRatings();
        this.grabFeatures();
      })
      .catch((err) => {
        console.log(err);
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
          currentStyleIndex: 0,
          currentStyleImgIndex: 0,
        })
      })
      .then(() => {
        this.setState({
          currentStyle: this.state.productStyles[this.state.currentStyleIndex],
        })
      })
      .then(() => {
        this.setState({
          styleImages: this.state.currentStyle.photos,
        })
      })
      .then(() => {
        this.setState({
          currentImg: this.state.styleImages[this.state.currentStyleImgIndex],
          currentImgStyle: this.state.imageStyles.defaultView,
          thumbIsLoading: false,
        })
      })
  }

  grabFeatures() {
    axios({
      method: 'get',
      url: `http://52.26.193.201:3000/products/${this.state.productId}`
    })
    .then((data) => {
      this.setState({
        productInfo: data.data,
        productFeatures: data.data.features,
      })
    })
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

  changeView() {
    if (this.state.currentImgStyleName === 'defaultView') {
      this.setState({
        currentImgStyleName: 'enlargedView',
      })
    }
    if (this.state.currentImgStyleName === 'enlargedView') {
      this.setState({
        thumbIsLoading: false,
        currentImgStyleName: 'defaultView',
      })
    }
  }

  pickImage(index) {
    this.setState({
      currentImg: this.state.styleImages[index],
      currentStyleImgIndex: index,
    })
  }

  prevImage() {
    {
      this.state.styleImages[this.state.currentStyleImgIndex - 1] !== undefined
      ? this.setState({
        currentStyleImgIndex: this.state.currentStyleImgIndex - 1,
        currentImg: this.state.styleImages[this.state.currentStyleImgIndex - 1],
      })
      : this.setState({
        currentImg: this.state.styleImages[this.state.styleImages.length - 1],
        currentStyleImgIndex: this.state.styleImages.length - 1,
      })
    }
  }

  nextImage() {
    {
      this.state.styleImages[this.state.currentStyleImgIndex + 1] !== undefined
      ? this.setState({
        currentStyleImgIndex: this.state.currentStyleImgIndex + 1,
        currentImg: this.state.styleImages[this.state.currentStyleImgIndex + 1]
      })
    : this.setState({
        currentStyleImgIndex: 0,
        currentImg: this.state.styleImages[0]
      })
    }
  }

  stylePicker(index) {
    this.setState({
      currentStyle: this.state.productStyles[index],
      currentStyleIndex: index,
      styleImages: this.state.productStyles[index].photos,
      currentImg: this.state.productStyles[index].photos[this.state.currentStyleImgIndex],
    })
  }

  selectSize(event) {
    event.preventDefault();
    this.setState({
      currentSize: event.target.value,
      sizeSelected: true,
      openSizeSelector: false,
    })
  }

  sizeNotPicked() {
    if(!this.state.openSizeSelector) {
      this.setState({
        openSizeSelector: true,
      })
    } else {
      this.setState({
        openSizeSelector: false,
      })
    }
  }

  setQuantityArray(array) {
    this.setState({
      quantityArray: array,
    })
  }

  selectQ(number) {
    this.setState({
      quantity: number,
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
          <Content
            state={this.state}
            pickImage={this.pickImage.bind(this)}
            changeView={this.changeView.bind(this)}
            nextImage={this.nextImage.bind(this)}
            prevImage={this.prevImage.bind(this)}
            stylePicker={this.stylePicker.bind(this)}
            selectSize={this.selectSize.bind(this)}
            setQuantityArray={this.setQuantityArray.bind(this)}
            selectQ={this.selectQ.bind(this)}
            sizeNotPicked={this.sizeNotPicked.bind(this)}
          />
        </Grid>
      </Grid>
    )
  }
}

export default App;

