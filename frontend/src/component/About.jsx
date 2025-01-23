import React from 'react';
import './About.css'; // Import CSS for styling

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-header">About us</h1>

      <section className="about-section">
        <h2>About VVI</h2>
        <p>
          Welcome to VVI, your trusted partner in empowering women across Vietnam to take charge of their reproductive health. 
          With a focus on accessibility, privacy, and innovation, VVI is designed to support women aged 18–28 in urban areas 
          with advanced AI-driven features and culturally sensitive solutions.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Do</h2>
        <ul>
          <li><strong>Track Health with Precision:</strong> Monitor menstrual cycles, ovulation patterns, and fertility indicators effortlessly.</li>
          <li><strong>Receive Personalized Recommendations:</strong> Access AI-powered advice tailored to individual needs and goals.</li>
          <li><strong>Stay Informed and Alert:</strong> Benefit from timely notifications for contraceptive schedules, health check-ups, and milestones.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Why Choose VVI?</h2>
        <ul>
          <li><strong>Privacy You Can Trust:</strong> With industry-leading encryption and compliance with Vietnam’s Cyber-Information Security Law, your data is always safe.</li>
          <li><strong>Cultural Sensitivity:</strong> Our app is tailored to meet the cultural and social norms of Vietnam, ensuring you feel comfortable and understood.</li>
          <li><strong>Affordable and Accessible:</strong> VVI offers a freemium model, ensuring essential features are free, with affordable options for advanced functionalities.</li>
          <li><strong>Ease of Use:</strong> Designed for tech-savvy and non-tech-savvy users alike, our user-friendly interface ensures everyone can navigate with confidence.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Key Features</h2>
        <ul>
          <li><strong>AI-Powered Chatbot:</strong> Get instant, private, and culturally appropriate responses to your reproductive health questions.</li>
          <li><strong>Customizable Notifications:</strong> Never miss important health updates, from cycle tracking to daily health tips.</li>
          <li><strong>Health Monitoring Dashboard:</strong> A comprehensive view of your reproductive health trends and progress.</li>
          <li><strong>Data Security:</strong> Robust privacy settings and multi-factor authentication keep your sensitive information protected.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower women in Vietnam to make informed decisions about their health through accessible, 
          personalized, and innovative solutions. We aim to foster a supportive community where reproductive health is 
          prioritized without fear or stigma.
        </p>
        <p>Together, let’s break barriers and redefine reproductive health management for a brighter, healthier future.</p>
      </section>
    </div>
  );
};

export default About;
