import { Link } from "react-router-dom";
import { Navbar } from "./component/Navbar";

function Home() {
    return (
        <>
            <header className="header">
                <Navbar />
            </header>
            <div className="content">
                <h1>Home</h1>
                <p>Welcome to the Home page!</p>
            </div>
        </>
    );
}

export default Home;