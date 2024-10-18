import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

// import '../style/PdfSlitter.css'; // Import the CSS file

function PDFSplitter() {

  // state variables to store the selected file and the max size (sent to the backend)
  const [selectedFile, setSelectedFile] = useState(null); // selectedFile initially set to 'null'
  const [maxSize, setMaxSize] = useState(1); // default max_size will be 1 MB...

  // event listener for file selection input (to set the selectedFile state)
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // same for the max size input...
  const handleMaxSizeChange = (event) => {
    setMaxSize(event.target.value);
  };

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a PDF file to upload.');

      return;
    }

    // Prepare form data (infos to be sent to the backend)
    const formData = new FormData();

    formData.append('pdf_file', selectedFile);
    formData.append('max_size', maxSize);

    // POST request to the backend
    const base_url = 'http://pqpmds.us-east-1.elasticbeanstalk.com'; // help

    fetch(`${base_url}/api/split`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful response
          
          return response.blob(); // returns a promise, resolved with the value of the body text

        } else {
          // Handle server errors
          alert('An error occurred while splitting the PDF.');

          throw new Error('Server response wasn\'t OK');
        }
      })
      .then((blob) => {
        // Create a link to download the split PDF files as a ZIP
        const url = window.URL.createObjectURL(new Blob([blob])); // thx copilot
        console.log(`Download file url: ${url}`);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'split_pdfs.zip');

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })

      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        PDF Splitter
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" >
          {/* <InputLabel htmlFor="pdfFile" >Upload PDF File</InputLabel> shit not working...*/}
          <TextField
            id="pdfFile"
            type="file"
            onChange={handleFileChange}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="max-size-label">Maximum Size per Part (MB)</InputLabel>
          <Select
            labelId="max-size-label"
            id="maxSize"
            value={maxSize}
            label="Maximum Size per Part (MB)"
            onChange={handleMaxSizeChange}
          >
            {[1,2,5,10,15,20,25,30,35,40,45,50].map(element => {
              <MenuItem value={element}>{element} MB</MenuItem>
            })}

            {/* <MenuItem value={1}>1 MB</MenuItem>
            <MenuItem value={2}>2 MB</MenuItem>
            <MenuItem value={5}>5 MB</MenuItem>
            <MenuItem value={10}>10 MB</MenuItem>
            <MenuItem value={20}>20 MB</MenuItem>
            <MenuItem value={50}>50 MB</MenuItem> */}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '20px' }}
        >
          Split PDF
        </Button>
      </form>
    </Container>
  );
}

export default PDFSplitter;

