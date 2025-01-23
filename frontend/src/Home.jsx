import { Link } from "react-router-dom";
import { Navbar } from "./component/Navbar";
import { Outlet } from "react-router-dom";
import Calendar from "./component/Calendar";
import About from "./component/about";
import HomeCarousel from "./component/HomeCarousel";

function Home() {
    return (
        <div id ="root">
            <div className="carousel">
                <HomeCarousel />
            </div>

            <div id="calendar-box" className="calendar-box">
                 <Calendar />
            </div>

            <div id="about-box" className="about-box">
                 <About />
            </div>n
        </div>
    );
}

export default Home;