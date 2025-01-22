import { Link } from "react-router-dom";
import { Navbar } from "./component/Navbar";
import { Outlet } from "react-router-dom";
import Calendar from "./component/Calendar";

function Home() {
    return (
        <div id ="root">
         

            <div className="content">
                <h1>Home</h1>
                <p>Welcome to the Home page!</p>
            </div>

            <p>Welcome to the Home page!</p>
            <p>Welcome to the Home page!</p>
            <p>Welcome to the Home page!</p>
            <p>Welcome to the Home page!</p>
            <p>Welcome to the Home page!</p>
            <p>Welcome to the Home page!</p>
            <p>Welcome to the Home page!</p>
            <p>Welcome to the Home page!</p>

            <div id="calendar-box" className="calendar-box">
                 <Calendar />
            </div>
        </div>
    );
}

export default Home;