const SimilarProductItem = props => {
  const {content} = props
  console.log(content)
  const newlist = content.map(element => ({
    ...element,
    imageUrl: element.image_url,
    totalReviews: element.total_reviews,
  }))
  return (
    <ul className="products-list">
      {newlist.map(product => {
        const {id, title, brand, imageUrl, rating, price} = product
        return (
          <li className="product-item" key={id}>
            <img
              src={imageUrl}
              alt={`similar product ${title}`}
              className="thumbnail"
            />
            <h1 className="title">{title}</h1>
            <p className="brand">by {brand}</p>
            <div className="product-details">
              <p className="price">Rs {price}/-</p>
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default SimilarProductItem
