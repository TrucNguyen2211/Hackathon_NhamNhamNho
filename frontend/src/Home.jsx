import { Link } from "react-router-dom";
import { Navbar } from "./component/Navbar";
import Calendar from "./component/Calendar";

function Home() {
    return (
        <div id ="root">
            <header className="header">
                <Navbar />
            </header>

            <div className="content">
                <h1>Home</h1>
                <p>Welcome to the Home page!</p>
            </div>

            <div className="calendar-box">
                 <Calendar />
            </div>
        </div>
    );
}

export default Home;