import React, { useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../assets/bg.jpeg'


const Home = () => {
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get('http://localhost:7000');
        console.log(response.data); // Should output 'Server is running on port 6000'
      } catch (error) {
        console.error('Error connecting to server:', error);
      }
    };

    checkServer();
  }, []);

  return (
    <div
    className="d-flex justify-content-center align-items-center text-center"
    style={{ backgroundImage: `url("${backgroundImage}")`, backgroundSize: 'cover',height: '92%' ,color: 'white' }}
  >
    <div>
      <h1 className="display-4 fw-bold">GRADE MASTER </h1>
      <h2 className>AUTOMATED EVALUATION </h2>
      <h4 className="">Grade Master is an AI-powered platform that automates the evaluation of student answers, 
        providing quick and consistent grading for various types of assessments.​
      </h4>
    </div>
  </div>
  );
};

export default Home;
