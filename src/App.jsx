import React, { useContext } from "react";
import { ProductContext } from "./context/ProductContext";
import { ReactComponent as PlusIcon } from "../src/icon/icon-increment-quantity.svg";
import { ReactComponent as MinusIcon } from "../src/icon/icon-decrement-quantity.svg";
import { ReactComponent as CartIcon } from "../src/icon/icon-add-to-cart.svg";
import { ReactComponent as EmptyCartIcon } from "../src/icon/illustration-empty-cart.svg";
import { ReactComponent as RemoveIcon } from "../src/icon/icon-remove-item.svg";
import { ReactComponent as CarbonNeutralIcon } from "../src/icon/icon-carbon-neutral.svg";
import { ReactComponent as OrderConfirmedIcon } from "../src/icon/icon-order-confirmed.svg";

// App ----------------------------------------------------------------------
function App() {
  const { modal } = useContext(ProductContext);
  return (
    <div className="App">
      <ProductSection />
      <CartSection />
      {modal ? <ModalOverlay /> : null}
      <Attribution />
    </div>
  );
}

export default App;

// Product section ----------------------------------------------------------
function ProductSection() {
  const { products } = useContext(ProductContext);
  return (
    <section className="product-container">
      <h2 className="title">Desserts </h2>
      <div className="product-section">
        {products.map((product, id) => (
          <ProductCard product={product} key={id} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <ProductImage product={product} />
      <ProductDetails product={product} />
    </div>
  );
}
function ProductImage({ product }) {
  const { isAddedToCart } = useContext(ProductContext);
  const { desktop, tablet, mobile, thumbnail } = product.image;

  const isAlreadyInCart = isAddedToCart(product.name);

  return (
    <div
      className="product-image"
      style={isAlreadyInCart ? { outline: "1px solid brown" } : {}}
    >
      <picture>
        <source media="(min-width:1440px)" srcSet={desktop} />
        <source
          media="(max-width:1440px) and (min-width:768px)"
          srcSet={tablet}
        />
        <source media="(max-width:767px)" srcSet={mobile} />
        <img src={thumbnail} alt="product-image" />
      </picture>
      {isAlreadyInCart ? (
        <CounterButton product={product} />
      ) : (
        <AddToCartButton product={product} />
      )}
    </div>
  );
}

function CounterButton({ product }) {
  const { productQuantity, increment, decrement } = useContext(ProductContext);
  const quantity = productQuantity(product.name);

  return (
    <div className="counter-btn">
      <button className="decrement-btn" onClick={() => decrement(product.name)}>
        <MinusIcon />
      </button>
      <span className="counter-value">{quantity}</span>
      <button className="increment-btn" onClick={() => increment(product.name)}>
        <PlusIcon />
      </button>
    </div>
  );
}

function AddToCartButton({ product }) {
  const { addToCart } = useContext(ProductContext);
  return (
    <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
      <CartIcon />
      Add to Cart
    </button>
  );
}

function ProductDetails({ product }) {
  return (
    <div className="product-details">
      <p className="category">{product.category}</p>
      <h3 className="name">{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
    </div>
  );
}

// Cart Section -----------------------------------------------

function CartSection() {
  const { cart, removeItem, orderTotal, handleModal } =
    useContext(ProductContext);
  const totalAmount = orderTotal();
  return (
    <div className="cart-section">
      <h2>Your Cart ({cart.length})</h2>
      <Cart className="cart">
        {cart.length !== 0 ? (
          cart.map((item, id) => (
            <CartItem item={item} removeItem={removeItem} />
          ))
        ) : (
          <EmptyCart />
        )}
      </Cart>
      {cart.length !== 0 ? (
        <Order totalAmount={totalAmount} handleModal={handleModal} />
      ) : null}
    </div>
  );
}
function Order({ totalAmount, handleModal }) {
  return (
    <div className="order">
      <OrderTotal totalAmount={totalAmount} className="order-total" />
      <p className="carbon-neutral-label">
        <CarbonNeutralIcon />
        This is a <b> Carbon neutral </b> delivery
      </p>
      <button className="confirm-btn" onClick={() => handleModal()}>
        Confirm Order
      </button>
    </div>
  );
}
function OrderTotal({ totalAmount, className = "" }) {
  return (
    <div className={className}>
      <p className="total-amount">Order total</p>
      <p className="total-amount-value">${totalAmount.toFixed(2)}</p>
    </div>
  );
}

function Cart({ children, className = "" }) {
  return <ul className={className}>{children}</ul>;
}

function CartItem({ item, removeItem }) {
  const priceByQuantity = item.price * item.quantity;
  return (
    <li className="cart-item">
      <div className="item-details">
        <p className="name">{item.name}</p>
        <span className="price-details">
          <p className="quantity">{item.quantity}x</p>
          <p className="price">@${item.price.toFixed(2)}</p>
          <p className="price-by-quantity">${priceByQuantity.toFixed(2)}</p>
        </span>
      </div>
      <button className="remove-btn" onClick={() => removeItem(item.name)}>
        <RemoveIcon />
      </button>
    </li>
  );
}

function EmptyCart() {
  return (
    <div className="empty-cart">
      <EmptyCartIcon />
      <p> Your added items will appear here</p>
    </div>
  );
}
// Modal section ----------------------------------------------------

function ModalOverlay() {
  const { handleModal } = useContext(ProductContext);

  return (
    <div className="modal-overlay" onClick={handleModal}>
      <ConfirmModal />
    </div>
  );
}

const ButtonStyle = {
  outline: "none",
  fontWeight: 600,
  border: "none",
  marginTop: "1.1rem",
  borderRadius: "20px",
  width: "100%",
  height: `40px`,
  textAlign: "center",
  backgroundColor: "hsl(12, 57%, 50%)",
  color: "hsl(20, 50%, 98%)",
  cursor: "pointer",
};

function ConfirmModal() {
  const { cart, orderTotal, resetAll } = useContext(ProductContext);
  const totalAmount = orderTotal();
  return (
    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
      <div>
        <OrderConfirmedIcon />
        <h2>Order Confirmed</h2>
        <p>We hope you enjoy your food!</p>
      </div>
      <ul className="modal-list">
        {cart.map((item) => (
          <ModalItem item={item} />
        ))}
      </ul>
      <div>
        <OrderTotal totalAmount={totalAmount} className="modal-order-total" />
        <button style={ButtonStyle} onClick={() => resetAll()}>
          Start New Order
        </button>
      </div>
    </div>
  );
}
function ModalItem({ item }) {
  const totalPrice = item.price * item.quantity;
  return (
    <li className="modal-item">
      <div className="image-container">
        <img src={item.image.thumbnail} alt={item.name} />
      </div>
      <div className="details">
        <h3>{item.name}</h3>
        <p className="quantity-and-price">
          <span>{item.quantity}x</span>
          <span>@${item.price}</span>
        </p>
      </div>
      <p className="total-pricing">${totalPrice.toFixed(2)}</p>
    </li>
  );
}

function Attribution() {
  return (
    <div class="attribution">
      Challenge by{" "}
      <a href="https://www.frontendmentor.io?ref=challenge">Frontend Mentor</a>.
      Coded by <a href="#">Ashish Vasava</a>.
    </div>
  );
}
