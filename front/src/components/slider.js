import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import icecream from "../img/icecream.jpg"
import icecream1 from "../img/icecream1.jpg"
import icecream2 from "../img/icecream2.jpeg"


function Slider() {
  return (
    <Carousel>
      <Carousel.Item>
        <img alt='1' src={icecream} text="First slide" style={{width: "40%", float: "center"}} />
      </Carousel.Item>
      <Carousel.Item>
        <img alt='2' src={icecream1}  text="Second slide" style={{width: "40%", float: "center"}} />
      </Carousel.Item>
      <Carousel.Item>
        <img alt='3' src={icecream2} text="Third slide" style={{width: "40%", float: "center"}} />
      </Carousel.Item>
    </Carousel>
  );
}

export default Slider;