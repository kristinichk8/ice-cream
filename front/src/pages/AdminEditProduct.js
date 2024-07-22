import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminEditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Set initial form data state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    amount: '',
    img: '',
    category: '',
    country: '',
    year: '',
    allerg: '',
  });

  const getProductById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8081/products/${id}`);
      setProduct(response.data);

      // Set initial form data based on the product
      setFormData({
        name: response.data.name,
        price: response.data.price,
        amount: response.data.amount,
        img: response.data.img,
        category: response.data.category,
        country: response.data.country,
        year: response.data.year,
        allerg: response.data.allerg,
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Товар не найден');
      } else {
        console.error('Ошибка при запросе данных о товаре');
      }
    }
  };

  useEffect(() => {
    getProductById(id);
  }, [id]);

  if (!product) {
    return <div>Товар не найден</div>;
  }

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Отправляем PUT-запрос на сервер
      await axios.put(`http://localhost:8081/productsupdate/${id}`, formData);
      alert('Продукт изменен');
    } catch (error) {
      alert('Ошибка при изменении продукта');
      console.error('Ошибка при изменении продукта:', error);
    }
  };

    return (
        <div>
        <h2>Редактирование продукта</h2>
        <form onSubmit={handleSubmit}>
            <label>
            Название:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <br />
            <label>
            Цена:
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </label>
            <br />
            <label>
            Количество:
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </label>
            <br />
            <label>
            Путь к изображению:
            <input type="text" name="img" value={formData.img} onChange={handleChange} required />
            </label>
            <br />
            <label>
            Категория:
            <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Ореховые">Ореховые</option>
                <option value="Ягодные">Ягодные</option>
                <option value="Пломбир">Пломбир</option>
            </select>
            </label>
            <br />
            <label>
            Страна производства:
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />
            </label>
            <br />
            <label>
            Год выпуска:
            <input type="number" name="year" value={formData.year} onChange={handleChange} required />
            </label>
            <br />
            <label>
            Гипоаллергенность:
            <input type="checkbox" name="allerg" checked={formData.allerg} onChange={handleChange} />
            </label>
            <br />
            <button type="submit">Сохранить изменения</button>
        </form>
        </div>
    );
    };

    export default AdminEditProduct;
