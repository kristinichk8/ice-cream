class Cart {
  constructor() {
    this.items = {};
  }

  addItem(product) {
    const productId = product.id;

    if (this.items[productId]) {
      if (this.items[productId].quantity < product.amount) {
        this.items[productId].quantity += 1;
      }
    } else {
      this.items[productId] = {
        product,
        quantity: 1,
      };
    }
  }

  updateQuantity(productId, newQuantity) {
    if (this.items[productId]) {
      const product = this.items[productId].product;
      if (newQuantity <= product.amount) {
        this.items[productId].quantity = newQuantity;
      }
    }
  }

  getItems() {
    return Object.values(this.items);
  }

  clearCart() {
    this.items = {};
  }
}

module.exports = Cart;
