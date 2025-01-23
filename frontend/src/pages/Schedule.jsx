import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "./Schedule.css";
import "leaflet/dist/leaflet.css";
import hospitalIconImg from './hospital.png';

const Schedule = () => {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);
    const [showBooking, setShowBooking] = useState(false);

    useEffect(() => {
        if (mapInstance.current) return;

        const userLocation = [10.762622, 106.660172];
        mapInstance.current = L.map(mapContainer.current).setView(userLocation, 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance.current);

        const userIcon = L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png", // Cute target icon
            iconSize: [40, 40], 
            iconAnchor: [20, 40], 
            popupAnchor: [0, -40]
        });

        L.marker(userLocation, { icon: userIcon })
            .addTo(mapInstance.current)
            .bindPopup('<div class="custom-popup">You are here!</div>')
            .openPopup();

        return () => {
            mapInstance.current.remove();
            mapInstance.current = null;
        };
    }, []);

    const findHospitals = () => {
        const overpassUrl = "https://overpass-api.de/api/interpreter";
        const query = `[out:json];node["amenity"="hospital"](around:5000,10.762622,106.660172);out;`;

        fetch(overpassUrl + "?data=" + encodeURIComponent(query))
            .then((response) => response.json())
            .then((data) => {
                data.elements.forEach((hospital) => {
                    const hospitalIcon = L.icon({
                        iconUrl: hospitalIconImg,
                        iconSize: [40, 40], 
                        iconAnchor: [20, 40], 
                        popupAnchor: [0, -40]
                    });

                    const marker = L.marker([hospital.lat, hospital.lon], { icon: hospitalIcon }).addTo(mapInstance.current)
                        .bindPopup(`
                            <div class="hospital-popup">
                                <h3>${hospital.tags.name || "Unnamed Hospital"}</h3>
                                <p>Address: ${hospital.tags["addr:full"] || "Unknown"}</p>
                                <button class="book-btn" id="book-btn-${hospital.id}">BOOK APPOINTMENT</button>
                            </div>
                        `);

                    marker.on("popupopen", () => {
                        document.getElementById(`book-btn-${hospital.id}`).addEventListener("click", () => {
                            setShowBooking(true);
                        });
                    });
                });
            })
            .catch((error) => {
                console.error("Error fetching hospital data:", error);
                alert("Failed to fetch hospital data.");
            });
    };

    return (
        <div style={{ padding: "5%" }}>
            <div className="search-container">
                <input type="text" className="search-box" placeholder="Type your location here" />
                <button className="btn" onClick={findHospitals}>
                    Find Hospitals
                </button>
            </div>
            <div ref={mapContainer} id="map"></div>

            {showBooking && (
                <div className="booking-form active">
                    <span className="close-btn" onClick={() => setShowBooking(false)}>X</span>
                    <h2>Register Form</h2>
                    <input type="text" placeholder="Full Name" />
                    <input type="text" placeholder="Email" />
                    <input type="text" placeholder="Phone Number" />
                    <input type="text" placeholder="Booking Date" />
                    <textarea placeholder="Symptoms"></textarea>
                    <button type="submit">SEND</button>
                </div>
            )}
        </div>
    );
};

export default Schedule;
