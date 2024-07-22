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

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    patronymic: '',
    login: '',
    email: '',
    password: '',
    password_repeat: '',
    rules: false
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
      .post('http://localhost:8081/users', formData) // Отправляем данные на сервер
      .then((response) => {
        console.log('Ответ сервера:', response.data);
        alert("Вы зарегистрированы!");
      })
      .catch((error) => {
        console.error('Ошибка отправки:', error);
        if (error.response && error.response.data) {
          alert(error.response.data.errors[0].msg);
        } else {
          alert('Произошла ошибка при отправке данных.');
        }
      });
  };
  
  
  
    return(
    <div style={{float: "left"}}> 
    <MDBContainer fluid>
      <MDBRow>

        <MDBCol sm='6'>

          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }}/>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

            <h3 className="fw-bold mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Регистрация</h3>
            <form onSubmit={handleSubmit}>
            <MDBInput wrapperClass='mb-3 mx-5 w-100' name = "name" label='Name' id='formControlLg' type='text' size='sm' value={formData.name} onChange={handleInputChange}/>
            <MDBInput wrapperClass='mb-3 mx-5 w-100' name = "surname" label='Surname' id='formControlLg' type='text' size='sm' value={formData.surname} onChange={handleInputChange} />
            <MDBInput wrapperClass='mb-3 mx-5 w-100' name = "patronymic" label='Patronymic' id='formControlLg' type='text' size='sm' value={formData.patronymic} onChange={handleInputChange} />
            <MDBInput wrapperClass='mb-3 mx-5 w-100' name = "login" label='Login' id='formControlLg' type='text' size='sm' value={formData.login} onChange={handleInputChange} />
            <MDBInput wrapperClass='mb-3 mx-5 w-100' name = "email" label='Email address' id='formControlLg' type='text'size='sm'  value={formData.email}  onChange={handleInputChange}/>
            <MDBInput wrapperClass='mb-3 mx-5 w-100' name = "password" label='Password' id='formControlLg' type='password' size='sm' value={formData.password} onChange={handleInputChange} />
            <MDBInput wrapperClass='mb-3 mx-5 w-100' name = "password_repeat" label='Password-repeat' id='formControlLg' type='password'size='sm' value={formData.password_repeat} onChange={handleInputChange} />
            <MDBCheckbox wrapperClass='mb-3 mx-5 w-100' name='rules' id='flexCheckDefault' label='Rules'value={formData.rules} />

            <Button style={{color: "white", backgroundColor: "#0969A2", marginLeft: "7%"}} type='submit'>Зарегистрироваться</Button>
            <p className='ms-5'>Уже зарегистрированы?  <a href="/login" class="link-info">Войти</a></p>
            </form>
          </div>

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://gas-kvas.com/grafic/uploads/posts/2023-10/1696418727_gas-kvas-com-p-kartinki-s-morozhenim-24.jpg"
            alt="Login image" className="w-100" style={{objectFit: 'cover', objectPosition: 'right', marginLeft: "-7%", marginTop: "15%"}} />
        </MDBCol>

      </MDBRow>

    </MDBContainer>

    </div>
    )
}
export default Registration