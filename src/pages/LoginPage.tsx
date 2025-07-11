// src/pages/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock } from '@mui/icons-material';




export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch("http://127.0.0.1:4000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Invalid login credentials.");
        }

        const data = await response.json();
        console.log("✅ Login successful:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);  // ✅ Store user ID
        navigate("/home");
    } catch (error) {
        alert("❌ Login failed!");
    }
};


return (
  <Box
    sx={{
      minHeight: '100vh',
      // Background image with optional overlay
      background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/my-login-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          p: 3, // slightly less padding
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(6px)',
          borderRadius: 3,
        }}
      >
        {/* Logo Section */}
        <Box display="flex" justifyContent="center" mb={1}>
          <img
            src="/FoodSave.logo.png"
            alt="FoodSave Logo"
            style={{ width: '170px', height: '170px' }}
          />
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          sx={{ mb: 1 }}
        >
          Welcome to FoodSave
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Please log in to continue
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </Typography>

            <Button variant="contained" color="primary" type="submit">
              Log In
            </Button>
          </Box>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  </Box>
);
}




