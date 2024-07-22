import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const AdminProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    amount: 0,
    img: '',
    category: '',
    country: '',
    year: 0,
    allerg: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Отправляем POST-запрос на сервер
      const response = await axios.post('http://localhost:8081/products', formData);
      alert('Продукт добавлен')
      console.log('Новый продукт:', response.data);
    } catch (error) {
        alert('Ошибка при создании продукта')
      console.error('Ошибка при создании продукта:', error);
    }
  };

  return (
    <div style={{margin: "3%"}}>
      <h2 style={{ marginBottom: "1%", color: "#0969A2" }}>Создание нового продукта</h2>
      <form  style={{margin: "3%",color: "#0969A2", fontWeight: "600", fontSize: "20px"}} onSubmit={handleSubmit}>
        <label style={{margin: "1%"}}>
          Название:
          <input type="text"style={{marginLeft: "1%"}}  name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label style={{margin: "1%"}}>
          Цена:
          <input type="number" style={{marginLeft: "1%"}}  name="price" value={formData.price} onChange={handleChange} required />
        </label>
        <br />
        <label style={{margin: "1%"}}>
          Количество:
          <input type="number" style={{marginLeft: "1%"}}  name="amount" value={formData.amount} onChange={handleChange} required />
        </label>
        <br />
        <label style={{margin: "1%"}}>
          Путь к изображению:
          <input type="text" style={{marginLeft: "1%"}}  name="img" value={formData.img} onChange={handleChange} required />
        </label>
        <br />
        <label style={{margin: "1%"}}>
          Категория:
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Ореховые">Ореховые</option>
            <option value="Ягодные">Ягодные</option>
            <option value="Пломбир">Пломбир</option>
          </select>
        </label>
        <br />
        <label style={{margin: "1%"}}>
          Страна производства:
          <input type="text" style={{marginLeft: "1%"}}  name="country" value={formData.country} onChange={handleChange} required />
        </label>
        <br />
        <label style={{margin: "1%"}}>
          Год выпуска:
          <input type="number" style={{marginLeft: "1%"}}  name="year" value={formData.year} onChange={handleChange} required />
        </label>
        <br />
        <label style={{margin: "1%"}}>
          Гипоаллергенность:
          <input type="checkbox" style={{marginLeft: "1%"}}  name="allerg" checked={formData.allerg} onChange={handleChange} />
        </label>
        <br />  
        <Button type="submit">Создать продукт</Button>
      </form>
    </div>
  );
};

export default AdminProduct;
