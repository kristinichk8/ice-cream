import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const ShopCart = () => {
    const [cartItems, setCartItems] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

    const getToken = () => localStorage.getItem('token');


    const updateQuantity = (productId, newQuantity) => {
        axios.put(`http://localhost:8081/cart/${productId}`, { quantity: newQuantity }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                const updatedCart = cartItems.map((item) =>
                    item.product.id === productId ? { ...item, quantity: newQuantity } : item
                );
                setCartItems(updatedCart);
            })
            .catch((error) => console.error('Ошибка:', error));
    };

    const getCartItems = () => {
        axios.get('http://localhost:8081/cart')
            .then((response) => {
                console.log(response.data);
                setCartItems(response.data);
            })
            .catch((error) => console.error('Ошибка:', error));
    };

    const createOrder = async () => {
        setIsPasswordVisible(true);
      };
    
      const handlePasswordChange = (event) => {
        setPassword(event.target.value);
      };

    const handleOrderConfirmation = async () => {
        try {
          const token = localStorage.getItem('token');
    
          // Выполняем запрос на сервер для проверки пароля
          const response = await axios.post(
            'http://localhost:8081/check-password',
            { password,token },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          // Если пароль верный, выполняем создание заказа
          if (response.data.success) {
            const orderResponse = await axios.post(
              'http://localhost:8081/orders',
              { cart: cartItems, token },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );    
            console.log('Order created:', orderResponse.data);
            alert('Ваш заказ оформлен!');
            // Дополнительные действия при успешном создании заказа
          } else {
            alert('Неверный пароль. Попробуйте еще раз.');
          }
        } catch (error) {
          console.error('Error creating order:', error);
          alert('Ошибка при создании заказа');
        }
      };


    const clearCart = () => {
        axios.delete('http://localhost:8081/cart', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then(() => {
                setCartItems([]);
            })
            .catch((error) => console.error('Ошибка:', error));
    };
    useEffect(() => {
        getCartItems();
    }, []);

    return (
        <div style={{margin: "7%"}}>
            <h1 style={{ margin: "1%", textAlign: "center", color: "#0969A2" }}>Корзина</h1>
            {cartItems.length !== 0 ? (
            <Button variant='danger' onClick={clearCart}>Очистить корзину</Button>):
            (<p  style={{color: "#0969A2", margin: "5%"}}>Ваша корзина пуста</p>)}
            <ul style={{margin: "3%"}}>
                {cartItems.map((item) => (
                    <li style={{ color: "#0969A2", fontWeight: "600", fontSize: "20px", margin: "2%"}}key={item.id} href={`/product/${item.id}`}>
                        {item.product.name}   <br />   Цена: {item.product.price} рублей<br />    Количество: {item.quantity}
                        <Button
                            style={{margin: "1%", fontSize: "18px", fontWeight: "900"}}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity == item.product.amount} // Делаем кнопку + нерабочей, если достигнуто максимальное количество
                        >
                            +
                        </Button>
                        <Button
                        style={{fontSize: "18px", fontWeight: "900"}}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity == 1} // Делаем кнопку - нерабочей, если количество равно 1
                        >
                            -
                        </Button><br />
                        <img src={`http://localhost:8081/images/${item.product.img}`} style={{ width: "20%", height: "20%" }} />
                        <hr style={{color: "#0969A2"}} />
                    </li>
                ))}
            </ul>
            {cartItems.length !== 0 &&
            <Button
                onClick={() => createOrder()}
            >
                Оформить заказ
            </Button>}<br />
            {isPasswordVisible && (
                <>
                    <input
                        style={{ margin: '2%', color: "#0969A2" }}
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button onClick={handleOrderConfirmation}>Подтвердить заказ</Button>
                </>
            )}
        </div>
    );
};

export default ShopCart;