import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from 'react-bootstrap';

const PersonalAccount = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8081/orders/${token}`);
        // Сортируем заказы от новых к старым
        const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const calculateTotalAmount = (cart) => {
    let totalAmount = 0;
    cart.forEach((cartItem) => {
      totalAmount += cartItem.product.price * cartItem.quantity;
    });
    return totalAmount;
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/delorder/${orderId}/${token}`);
      const updatedOrders = orders.filter(order => order.orderId !== orderId);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div>
      <h2 style={{color: "#0969A2", margin: "5%"}}>Мои заказы</h2>
      {orders.length === 0 ? (
        <p  style={{color: "#0969A2", margin: "5%"}}>У вас пока нет заказов.</p>
      ) : (
        <ul  style={{margin: "3%"}}>
          {orders.map((order) => (
  <li style={{ color: "#0969A2", fontWeight: "400", fontSize: "20px", margin: "2%"}}key={order.orderId}>
    <p>Заказ №{order.orderId}</p>
    <p>Статус: {order.status}</p>
    <p>Дата заказа: {new Date(order.date).toLocaleString()}</p>
    <p>Сумма заказа: {calculateTotalAmount(order.cart)} рублей</p>

    <p>Товары в заказе:</p>
    <ul>
      {order.cart.map((cartItem, index) => (
        <li key={index}>
          <p>Товар #{index + 1}</p>
          <img src={`http://localhost:8081/images/${cartItem.product.img}`} style={{ width: "20%", height: "20%" }} />
          <p>Название: {cartItem.product.name}</p>
          <p>Цена: {cartItem.product.price}</p>
          <p>Количество: {cartItem.quantity}</p>
        </li>
      ))}
    </ul>
    <Button variant='danger' onClick={() => handleDeleteOrder(order.orderId)}>Удалить заказ</Button>
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default PersonalAccount;
