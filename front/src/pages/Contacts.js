import {
    MDBContainer,
    MDBRow,
    MDBCol
  }
  from 'mdb-react-ui-kit';
  import map from "../img/map.png"
const Contacts = () => {
    return (
        <MDBContainer fluid style={{marginTop: "3%"}}>
        <MDBRow>
          <MDBCol sm='6'>
        <div style={{marginLeft: "30%", marginTop: "9%"}}>
        <h2 style={{color: "#0969A2"}}>Наш адрес:</h2>
            <p style={{color: "#3D9AD1"}}>г.Москва, Промышленный проезд, дом 10</p>
        <br />
        <h2 style={{color: "#0969A2"}}>Наш телефон:</h2>
            <p style={{color: "#3D9AD1"}}>+7 999 662-43-99</p>
        <br />
        <h2 style={{color: "#0969A2"}}>Наша почта:</h2>
            <p style={{color: "#3D9AD1"}}>icecreammm@gmail.com</p>
        <br />
        </div>
        </MDBCol>
        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src={map}
            alt="Login image" className="w-100" style={{objectFit: 'cover', objectPosition: 'right', marginLeft: "-7%", marginTop: "5%"}} />
        </MDBCol>

      </MDBRow>

    </MDBContainer>
    )
}
export default Contacts