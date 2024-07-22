import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Оформлен'); // Начальное значение фильтра
  const [cancelReason, setCancelReason] = useState(''); // Состояние для хранения причины отмены заказа
  const [cancelOrderId, setCancelOrderId] = useState(null); // Состояние для хранения ID заказа, который отменяется

  useEffect(() => {
    loadOrders();
  }, [statusFilter]); // Перезагрузка заказов при изменении статуса фильтра

  const loadOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/admin/orders/${statusFilter}`);
      const ordersData = response.data;

      // Получаем массив промисов для загрузки данных о пользователях
      const userPromises = ordersData.map((order) => getUser(order.userId));

      // Параллельно загружаем данные о пользователях
      const userDataArray = await Promise.all(userPromises);

      // Обновляем состояние с информацией о пользователях
      setOrders(
        ordersData.map((order, index) => {
          return { ...order, userData: userDataArray[index] };
        })
      );
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const getUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:8081/admin/orders/${orderId}/confirm`);
      loadOrders(); // После подтверждения заказа перезагружаем список заказов
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      await axios.put(`http://localhost:8081/admin/orders/${orderId}/cancel`, { reason });
      loadOrders(); // После отмены заказа перезагружаем список заказов
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const calculateTotalAmount = (cart) => {
    return cart.reduce((total, cartItem) => total + cartItem.product.price * cartItem.quantity, 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div style={{margin: "5%"}}>
      <h2 style={{color: "#0969A2", margin: "2%"}}>Администрирование заказов</h2>
      <a style={{color: "#0969A2", fontWeight: "600", fontSize: "20px"}}href='/admin/newproduct'>Добавить товар</a>
      <br />
      <a style={{color: "#0969A2", fontWeight: "600", fontSize: "20px"}} href='/admin/categories'>Администрирование категорий</a>
      <br />
      <label style={{textDecoration: "none", color: "#0969A2", fontWeight: "400", fontSize: "20px", marginTop: "2%", marginBottom: "2%"}}>
        Фильтр по статусу:
        <select style={{textDecoration: "none", color: "#0969A2", fontWeight: "400", fontSize: "20px"}} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "400", fontSize: "20px"}} value="Оформлен">Новые</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "400", fontSize: "20px"}} value="Подтвержден">Подтвержденные</option>
          <option style={{textDecoration: "none", color: "#0969A2", fontWeight: "400", fontSize: "20px"}} value="Отменен">Отмененные</option>
        </select>
      </label>
      <ul style={{textDecoration: "none", color: "#0969A2", fontWeight: "400", fontSize: "18px"}}>
        {orders.map((order) => (
          <li key={order.orderId}>
            <p>Заказ №{order.orderId}</p>
            <p>Статус: {order.status}</p>
            <p>Дата заказа: {formatDate(order.date)}</p>
            <p>Сумма заказа: {calculateTotalAmount(order.cart)} рублей</p>
            <p>
              Заказчик:{' '}
              {order.userData ? `${order.userData.surname} ${order.userData.name}  ${order.userData.patronymic}` : 'Загрузка данных о заказчике...'}
            </p>
            <p>Товары в заказе:</p>
            <ul>
              {order.cart.map((cartItem, index) => (
                <li key={index}>
                  <p>Товар #{index + 1}</p>
                  <img src={`http://localhost:8081/images/${cartItem.product.img}`} style={{ width: '20%', height: '20%' }} alt={cartItem.product.name} />
                  <p>Название: {cartItem.product.name}</p>
                  <p>Цена: {cartItem.product.price}</p>
                  <p>Количество: {cartItem.quantity}</p>
                </li>
              ))}
            </ul>
            {order.status !== 'Подтвержден' ? (
              <Button onClick={() => handleConfirmOrder(order.orderId)}>Подтвердить заказ</Button>
            ) : null}
            {order.status !== 'Отменен' ? (<Button variant='danger' style={{marginLeft: "1%"}}
              onClick={() => {
                setCancelOrderId(order.orderId);
              }}
            >
              Отменить заказ
            </Button>): null}
            
            {cancelOrderId === order.orderId && (
              <div style={{margin: "1%"}}>
                <label>
                  Причина отмены:
                  <input
                    type="text"
                    style={{marginLeft:"1%"}}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </label>
                <Button
                  variant='danger'
                  onClick={() => {
                    handleCancelOrder(order.orderId, cancelReason);
                    setCancelOrderId(null);
                    setCancelReason('');
                  }}
                >
                  Подтвердить отмену заказа
                </Button>
              </div>
            )}
          </li>
          
        ))}<hr style={{color: "#0969A2"}} />
      </ul>
    </div>
  );
};

export default AdminOrders;
