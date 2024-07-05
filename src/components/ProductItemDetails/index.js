import './index.css'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoIosStarOutline} from 'react-icons/io'
import {Link} from 'react-router-dom'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    currentTab: apiStatusConstants.inProgress,
    noOfItems: 1,
  }

  componentDidMount() {
    this.fetchDescription()
  }

  fetchDescription = async () => {
    this.setState({currentTab: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const element = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await element.json()
    if (element.ok === true) {
      const newdata = {
        ...data,
        imageUrl: data.image_url,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products,
      }
      this.setState({
        currentTab: apiStatusConstants.success,
        productDetails: newdata,
      })
    } else {
      this.setState({currentTab: apiStatusConstants.failure})
    }
  }

  substract = () => {
    const {noOfItems} = this.state
    if (noOfItems > 1) {
      this.setState(prev => ({noOfItems: prev.noOfItems - 1}))
    }
  }

  add = () => this.setState(prev => ({noOfItems: prev.noOfItems + 1}))

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProducts = () => {
    const {productDetails, noOfItems} = this.state
    console.log(productDetails)
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productDetails
    return (
      <div className="product-item-container">
        <div className="header-bag">
          <Header />
        </div>
        <div className="subs">
          <img src={imageUrl} alt="product" className="product-icon" />
          <div className="product-content-container">
            <h1 className="product-heading">{title}</h1>
            <p className="product-amount">{`RS ${price}/-`}</p>
            <div className="rating-review-body horizantal">
              <div className="horizantal review">
                <p className="rating-text">{rating}</p>
                <IoIosStarOutline className="star-icon" />
              </div>
              <p className="review-text">{`${totalReviews} Reviews`}</p>
            </div>
            <p className="item-text">{description}</p>
            <p className="item-text">
              <span className="item-sidetext">Available:</span>
              {availability}
            </p>
            <p className="item-text">
              <span className="item-sidetext">Brand:</span>
              {brand}
            </p>
            <hr className="line" />
            <div className="button-container">
              <button
                className="btn"
                onClick={this.substract}
                data-testid="minus"
                type="button"
              >
                <BsDashSquare />
              </button>
              <p className="item-text">{noOfItems}</p>
              <button
                className="btn"
                onClick={this.add}
                data-testid="plus"
                type="button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="button">ADD TO CART</button>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="item-sidetext">Similar products</h1>
          <SimilarProductItem content={similarProducts} />
        </div>
      </div>
    )
  }

  renderFailure = () => (
    <div className="no-products-view correction">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error view"
        alt="failure view"
      />
      <h1 className="no-products-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="shop-now-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  selectOne = () => {
    const {currentTab} = this.state
    switch (currentTab) {
      case apiStatusConstants.success:
        return this.renderProducts()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return <></>
    }
  }

  render() {
    return this.selectOne()
  }
}
export default ProductItemDetails
