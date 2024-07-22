import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Service from '../services/Service';
import axios from 'axios';

const Menu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(Service.isLoggedIn())
  const [icecreamImage, setIcecreamImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    import("../img/logo.jpg")
      .then((imageModule) => {
        setIcecreamImage(imageModule.default);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке изображения:", error);
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
  const logout = () => {
    Service.logout()
  }

  return (
    <div>
      <Link to="/">
        {icecreamImage && (
          <img alt="333" src={icecreamImage} style={{ width: "3%", float: "left", marginLeft: "4%", marginRight: "1%" }} />)}
      </Link>
      <Link to="/" style={{ float: "left", margin: "2%", textDecoration: "none", color: "#3D9AD1" }}>IceCream</Link>
      <Link to="/" style={{ float: "left", margin: "1%", color: "#0969A2", textDecoration: "none", border: "3px solid #0969A2", borderRadius: "10px", padding: "10px" }}>Главная</Link>
      <Link to="/directory" style={{ float: "left", margin: "1%", color: "#0969A2", textDecoration: "none", border: "3px solid #0969A2", borderRadius: "10px", padding: "10px" }}>Каталог</Link>
      <Link to="/contacts" style={{ float: "left", margin: "1%", color: "#0969A2", textDecoration: "none", border: "3px solid #0969A2", borderRadius: "10px", padding: "10px" }}>Контакты</Link>
      <Link to="/cart" style={{ float: "left", margin: "1%", color: "#0969A2", textDecoration: "none", border: "3px solid #0969A2", borderRadius: "10px", padding: "10px" }}>Корзина</Link>
      {isLoggedIn ? (
      <Link to="/lk" style={{ float: "left", margin: "1%", color: "#0969A2", textDecoration: "none", border: "3px solid #0969A2", borderRadius: "10px", padding: "10px" }}>Личный кабинет</Link>
      )
        : (null)
}
      {isAdmin && <Link to="/admin" style={{ float: "left", margin: "1%", color: "#0969A2", textDecoration: "none", border: "3px solid #0969A2", borderRadius: "10px", padding: "10px" }}>Админ-панель</Link>}
      {isLoggedIn ? (
        <Button href="/" onClick={logout} style={{ color: "#3D9AD1", backgroundColor: "#fff", border: "3px solid #3D9AD1", margin: "1%", padding: "10px", marginTop: "1%", marginLeft: "10%" }}>Выйти</Button>
      )
        : (
          <><Button href="/login" style={{ color: "#3D9AD1", backgroundColor: "#fff", border: "3px solid #3D9AD1", margin: "1%", marginTop: "1%", padding: "10px", marginLeft: "10%" }}>Вход</Button>
            <Button href="/registration"
              style={{ color: "#3D9AD1", backgroundColor: "#fff", border: "3px solid #3D9AD1", margin: "1%", marginTop: "1%", padding: "10px", marginLeft: "2%" }}
            >
              Регистрация
            </Button></>
        )}

    </div>
  );
};

export default Menu;
