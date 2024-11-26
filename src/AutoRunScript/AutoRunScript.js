// About.js
import React from 'react';

const handleButtonClick = async () => {
  try {
    const response = await fetch('http://localhost:5000/run-script', {
      method: 'POST',  // Gửi yêu cầu POST
      headers: {
        'Content-Type': 'application/json',  // Cấu hình header nếu gửi dữ liệu
      },
      body: JSON.stringify({ /* dữ liệu nếu có */ }) // Nếu có dữ liệu cần gửi
    });

    if (response.ok) {
      console.log('Script executed successfully!');
    } else {
      console.log('Failed to execute script');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

function AutoRunScript() {
  return (
    <div>
      <h1>React Puppeteer Example</h1>
      <button onClick={handleButtonClick}>Run Puppeteer Script</button>
    </div>
  );
}

export default AutoRunScript;