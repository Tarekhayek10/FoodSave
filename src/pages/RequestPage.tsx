import React, { useState, FormEvent } from 'react';
import { 
  Box, Typography, Button, Container, Paper, TextField, MenuItem, Fade 
} from '@mui/material';
import NavBar from '../components/NavBar';

interface Donation {
  _id: string;
  food_name: string;
  quantity: number;
  expiration_date: string;
}

export default function RequestPage() {
  const [location, setLocation] = useState('');
  const [foodCategory, setFoodCategory] = useState('');
  const [results, setResults] = useState<Donation[]>([]);
  const [clusterPrediction, setClusterPrediction] = useState<number | null>(null);

  const handleFindDonations = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:4000/donations");
      if (!response.ok) throw new Error("Failed to fetch donations.");
      const data: Donation[] = await response.json();
      setResults(data);
    } catch (error) {
      alert("Error fetching donations.");
    }
  };

  const handlePredictCluster = async () => {
    const features = [location.length, foodCategory.length]; // Example feature set
    try {
      const response = await fetch("http://127.0.0.1:4000/predict-cluster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });
      if (!response.ok) throw new Error("Failed to predict demand.");
      const data = await response.json();
      setClusterPrediction(data.kmeans_cluster);
    } catch (error) {
      alert("Error predicting food demand.");
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
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
              Request Food
            </Typography>
            <form onSubmit={handleFindDonations}>
              <TextField label="Your Location" fullWidth margin="normal" value={location} onChange={(e) => setLocation(e.target.value)} />
              <TextField select label="Desired Category" fullWidth margin="normal" value={foodCategory} onChange={(e) => setFoodCategory(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Fruits">Fruits</MenuItem>
                <MenuItem value="Vegetables">Vegetables</MenuItem>
                <MenuItem value="Meals">Meals</MenuItem>
              </TextField>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="contained" color="primary" type="submit">Find Donations</Button>
              </Box>
            </form>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="contained" color="secondary" onClick={handlePredictCluster}>
              Predict Food Demand
            </Button>
            {clusterPrediction !== null && (
              <Typography sx={{ mt: 2 }}>
                <strong>Predicted Cluster:</strong> {clusterPrediction}
              </Typography>
            )}
          </Box>

          <Fade in={results.length > 0}>
            <Box sx={{ mt: 4 }}>
              {results.map((item, i) => (
                <Paper key={item._id} sx={{ p: 2, mb: 2 }}>
                  <Typography><strong>Food:</strong> {item.food_name}</Typography>
                  <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
                  <Typography><strong>Expires On:</strong> {item.expiration_date}</Typography>
                </Paper>
              ))}
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
}
