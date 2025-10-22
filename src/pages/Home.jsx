// src/pages/Home.jsx
import './Home.css';
import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <h1></h1>
      <p> "Bendito es el fruto de tu vientre, mujer" </p>
        <div className="fruta-container">
          {['🍓','🍊','🍍','🍌','🍇','🍉','🍎', '🍒', '🍑', '🍈'].map((fruta, i) => (
          <span key={i} className="fruta" style={{ animationDelay: `${i * 0.3}s` }}>
          {fruta}
          </span>
          ))}
        </div>
      {/* fruta cayendo */}
    </div>
  );
};

export default Home;
