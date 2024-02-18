import React, { useState } from 'react';

function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState(null);

  const downloadFile = async () => {
    const startTime = Date.now();

    // Replace 'http://localhost:5000' with your server URL
    const response = await fetch('https://6l3c2lx0-80.inc1.devtunnels.ms');

    if (response.ok) {
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;

      // File size in Megabits (8 bits in a byte)
      const fileSizeInMegabits = 1000;

      // Download time in seconds
      const downloadTimeInSeconds = timeElapsed / 1000;

      // Calculate download speed in Mbps
      const downloadSpeedMbps = fileSizeInMegabits / downloadTimeInSeconds;

      setDownloadSpeed(downloadSpeedMbps.toFixed(2));
    }
  };

  return (
    <div className='text-white'>
      <h1>Bandwidth Test</h1>
      <button onClick={downloadFile}>Download File</button>
      {downloadSpeed && <p>Download Speed: {downloadSpeed} Mbps</p>}
    </div>
  );
}

export default SpeedTest;
