import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const Directory = () => {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8081/products')
      .then((response) => {
        const initialProducts = response.data;
        setOriginalProducts(initialProducts);
        setProducts(initialProducts);
      })
      .catch((error) => {
        console.error('Ошибка при запросе данных:', error);
      });
    axios.get(`http://localhost:8081/usersIsAdmin/${token}`)
      .then((response) => {
        setIsAdmin(response.data.isAdmin);
        console.log(response.data) // Предполагается, что сервер возвращает булевое значение
      })
      .catch((error) => {
        console.error('Ошибка при проверке статуса администратора:', error);
      });
  }, []);

  const sortProducts = (order) => {
    setSortOrder(order);
  };

  const filterProductsByCategory = (category) => {
    setCategoryFilter(category);
  };
  const addToCart = (productId) => {
    axios.post('http://localhost:8081/cart', { productId }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        // Дополнительные действия при успешном добавлении в корзину, если нужны
      })
      .catch((error) => console.error('Ошибка при добавлении в корзину:', error));
  };

  const deleteProduct = (productId) => {
    axios.delete(`http://localhost:8081/productsdelete/${productId}`)
      .then((response) => {
        // Handle successful deletion
        console.log('Product deleted successfully:', response.data);
        // Optionally: Update your local state or re-fetch the product list
      })
      .catch((error) => {
        // Handle deletion error
        console.error('Error deleting product:', error);
      });
  };


  useEffect(() => {
    let filteredProducts = [...originalProducts];
    if (categoryFilter !== 'all') {
      filteredProducts = filteredProducts.filter((product) => product.category === categoryFilter);
    }

    let sortedProducts = [...filteredProducts];
    switch (sortOrder) {
      case 'oldest':
        sortedProducts.sort((a, b) => a.year - b.year);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      default:
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
    }

    // Фильтрация по amount > 0
    sortedProducts = sortedProducts.filter((product) => product.amount > 0);

    setProducts(sortedProducts);
  }, [categoryFilter, sortOrder, originalProducts]);

  return (
    <>
      <h1 style={{ margin: "5%", textAlign: "center", color: "#0969A2" }}>КАТАЛОГ</h1>



      <div style={{ margin: "2%" }}>
        <label style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "20px"}}>Сортировать по:</label>
        <select style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} onChange={(e) => sortProducts(e.target.value)}>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}}value="newest">Новизне</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} value="oldest">Году производства</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} value="name">Наименованию</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} value="price">Цене</option>
        </select>
      </div>
      <div style={{ margin: "2%" }}>
        <label style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "20px"}}>Фильтровать по категории: </label>
        <select style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} onChange={(e) => filterProductsByCategory(e.target.value)}>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} value="all">Все</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} value="Ореховые">Ореховые</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} value="Ягодные">Ягодные</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "16px"}} value="Пломбир">Пломбир</option>
        </select>
      </div>
      <ul>
        {products.map((product) => (
          <div style={{ margin: "2%" }}>
            <a key={product.id} style={{ textDecoration: "none", color: "#0969A2", fontWeight: "600", fontSize: "24px" }} href={`/product/${product.id}`}>
              {product.name} - {product.price} руб.
              
              <img src={`http://localhost:8081/images/${product.img}`} style={{ width: "20%", height: "20%" }} />
            </a>
<Button style={{ color: "white", backgroundColor: "#0969A2", margin: "4%" }} onClick={() => addToCart(product.id)}>В корзину</Button>

            {isAdmin && (
              <div>
                <a style={{ textDecoration: "none" }} href={`/admin/editproduct/${product.id}`}>Редактировать товар</a>
                <Button variant='danger' style={{ margin: "1%" }} onClick={() => deleteProduct(product.id)}>Удалить товар</Button>
              </div>
            )}
            <hr style={{color: "#0969A2"}} />
          </div>
        ))}
      </ul>
    </>
  );
};

export default Directory;
