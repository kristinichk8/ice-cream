import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import axios from 'axios'; 
import { Button } from 'react-bootstrap';

function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:8081/login', formData) // Отправляем данные на сервер
      .then((response) => {
        console.log('Ответ сервера:', response.data);
        localStorage.setItem('token', response.data.token);

        // Устанавливаем флаг авторизации
        setIsLoggedIn(true);

      })
      .catch((error) => {
        console.error('Ошибка отправки:', error);
        if (error.response && error.response.data) {
          alert(error.response.data.error);
        } else {
          alert('Произошла ошибка при отправке данных.');
        }
      });
  };

  if (isLoggedIn) {
    window.location.href = "/"
  }
  
  
  
    return(
    <div style={{float: "left"}}> 
    <MDBContainer fluid>
      <MDBRow>

        <MDBCol sm='6'>

          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }}/>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

            <h3 className="fw-bold mb-3 ps-5 pb-3" style={{letterSpacing: '1px', color: "#0969A2"}}>Авторизация</h3>
            <form onSubmit={handleSubmit}>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' name = "login" label='Login' id='formControlLg' type='text' size="lg" value={formData.login} onChange={handleInputChange} />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' name = "password" label='Password' id='formControlLg' type='password' size="lg" value={formData.password} onChange={handleInputChange} />

            <Button style={{color: "white", backgroundColor: "#0969A2", margin: "9%"}} type='submit'>Войти</Button>
            <p className='ms-5'>Ещё не зарегистрированы?  <a href="/registration" class="link-info">Регистрация</a></p>
            </form>
          </div>

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://kartinki.pics/uploads/posts/2021-07/1625276513_31-kartinkin-com-p-kafe-morozhenoe-v-sankt-peterburge-yeda-kr-44.jpg"
            alt="Login image" className="w-100" style={{objectFit: 'cover', objectPosition: 'right'}} />
        </MDBCol>

      </MDBRow>

    </MDBContainer>

    </div>
    )
}

export default Login