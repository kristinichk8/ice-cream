import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); // Используем состояние для хранения данных о товаре

  const getProductById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8081/products/${id}`);
      setProduct(response.data); // Сохраняем данные о товаре в состоянии
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Товар не найден');
      } else {
        console.error('Ошибка при запросе данных о товаре');
      }
    }
  };

  // Вызываем функцию для получения данных о товаре при монтировании компонента
  useEffect(() => {
    getProductById(id);
  }, [id]);

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <div style={{margin: "3%",color: "#0969A2", fontWeight: "600", fontSize: "16px"}}>
      <h1 style={{ margin: "1%", color: "#0969A2" }}>{product.name}</h1>
      <img src={`http://localhost:8081/images/${product.img}`} style={{width: "20%"}}/>
      <p>Цена: {product.price} руб.</p>
      <p>Страна-производитель: {product.country}</p>
      <p>Год выпуска: {product.year}</p>
      <p>Категория: {product.category}</p>
      <Button className="add-to-cart">В корзину</Button>
    </div>
  );
};

export default Product;
