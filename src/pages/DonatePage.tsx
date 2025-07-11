// DonatePage.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  CardMedia,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CloudUpload, Science } from '@mui/icons-material';

// 1. Define a simple mock useAuth here
function useAuth() {
  const logout = () => {
    console.log("Logged out (mock)!");
    // You could also do something like window.alert("Logged out!");
  };
  return { logout };
}

function NavBar() {
  const { logout } = useAuth();  // your mock or real logout function
  const navigate = useNavigate(); // from react-router-dom

  const handleLogout = () => {
    // 1. Call your logout logic
    logout();
    // 2. Navigate to the login page
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" sx={{ minHeight: 50 }}>
      <Toolbar sx={{ minHeight: '50px !important', width: '100%' }}>
        {/* Left side: Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src="/FoodSave.Logo.png"
            alt="FoodSave Logo"
            style={{ width: 60, marginRight: 8 }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            FoodSave
          </Typography>
        </Box>

        {/* Right side: Nav Items */}
        <Box>
          <Button color="inherit" onClick={() => navigate("/home")} sx={{ color: '#fff' }}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate("/donate")} sx={{ color: '#fff' }}>
            Donate
          </Button>
          <Button color="inherit" onClick={() => navigate("/request")} sx={{ color: '#fff' }}>
            Request
          </Button>
          <Button color="inherit" onClick={handleLogout} sx={{ color: '#fff' }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}


export default function DonatePage() {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>('');

  const [predictedCategory, setPredictedCategory] = useState<string>('');
  const [predictedQuality, setPredictedQuality] = useState<string>('');

  // Handle image upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Mock function to call the backend ML endpoint
  const handleClassify = async () => {
    try {
      console.log('Calling ML backend with image:', selectedFile);
      setPredictedCategory('Fruits');
      setPredictedQuality('Safe to Donate');
    } catch (error) {
      console.error('Error calling ML endpoint:', error);
    }
  };

  // Final donation submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("food_item", foodName);
    formData.append("quantity", quantity);
    formData.append("expiration_date", expirationDate);
    if (selectedFile) {
        formData.append("image", selectedFile);
    }

    try {
        const response = await fetch("http://127.0.0.1:4000/donate", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("✅ Donation submitted successfully!");
            setFoodName('');
            setQuantity('');
            setExpirationDate('');
            setSelectedFile(null);
            setPreviewURL('');
        } else {
            alert("❌ Failed to submit donation.");
        }
    } catch (error) {
        console.error("❌ Error:", error);
        alert("❌ Error submitting donation.");
    }
};

  return (
    <>
      <NavBar />

      <Box
        sx={{
          minHeight: 'calc(100vh - 50px)',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
              Donate Food
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Food Name"
                fullWidth
                margin="normal"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
              <TextField
                label="Quantity"
                fullWidth
                margin="normal"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <TextField
                label="Expiration Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />

              <Box sx={{ my: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  component="label"
                >
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>

              {previewURL && (
                <CardMedia
                  component="img"
                  height="200"
                  image={previewURL}
                  alt="Preview"
                  sx={{ mb: 2, borderRadius: 2 }}
                />
              )}

              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Science />}
                  onClick={handleClassify}
                  disabled={!selectedFile}
                >
                  Classify &amp; Predict Quality
                </Button>
              </Box>

              {predictedCategory && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Predicted Category:</strong> {predictedCategory}
                </Typography>
              )}
              {predictedQuality && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Predicted Quality:</strong> {predictedQuality}
                </Typography>
              )}

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="contained" color="primary" type="submit" sx={{ px: 4 }}>
                  Submit Donation
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}