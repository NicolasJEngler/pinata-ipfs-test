import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // NOTE: you'll need a Pinata API key, a Pinata secret set up in the .env.local file
  // The Pinata file pinning API endpoint is https://api.pinata.cloud/pinning/pinFileToIPFS
  // also set it up in your .env.local file

  // More info about pinning: https://medium.com/pinata/what-is-an-ipfs-pinning-service-f6ed4cd7e475
  // NOTE: once your files have been pinned through the API, you should see them in your Pinata pinmanager (Files section) 
  const [file, setFile] = useState(null),
        FormData = require('form-data');

  // Debugging function to make sure the file selected and the env vars are working fine
  const checkDataLog = () => {
    console.log('File selected: ', file);
    console.log('Environment variables: ', process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET, process.env.REACT_APP_PINATA_PIN_API_URL);
  };
  
  const pinFileToIPFS = () => {
    // Set a variable for the pinning URL
    const url = process.env.REACT_APP_PINATA_PIN_API_URL;

    // Set a variable to send form data
    let data = new FormData();

    // Append the selected file into the form data
    data.append('file', file);

    // Execute a POST request to Pinata's file pinning endpoint
    return axios.post(url,
      data,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET
        }
      }
    ).then(function (response) {
        // Handle response here
        console.log('File uploaded successfully: ', response);
        // NOTE: IPFS hashes (basically the "url" of the file), can be access through HTTP protocols
        // and also through IPFS protocol, i.e.:
        // https://ipfs.io/ipfs/Qma93hMqC4SiDqrheVCwKEAwwYkaurTUJ6u8q1W3sXHbNY
        // or
        // ipfs://Qma93hMqC4SiDqrheVCwKEAwwYkaurTUJ6u8q1W3sXHbNY
    }).catch(function (error) {
        // Handle error here
        console.log('There was an error uploading your file: ', error);
    });
  };

  // This hook only logs the file selected and some env vars into the console once a file is selected
  // Only intended for debugging purposes
  useEffect(() => {
    checkDataLog();
  }, 
  /* eslint-disable */
  [file]);
  /* eslint-enable */

  return (
    <div className="App">
      <input type="file" onChange={(e) => {setFile(e.target.files[0])}} />
      <button onClick={pinFileToIPFS}>Upload to IPFS!</button>
    </div>
  );
}

export default App;
