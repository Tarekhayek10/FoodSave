// src/pages/SignUpPage.tsx
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
import { Person, Email, Lock } from '@mui/icons-material';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate(); // ✅ Use navigate instead of useAuth

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Sign-up failed.");
      }

      alert("✅ Registration successful!");
      navigate("/login"); // ✅ Redirect to login after signup
    } catch (error) {
      alert("❌ Sign-up failed!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" align="center">Create a New Account</Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Join FoodSave to help reduce food waste
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }} />
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }} />
          <TextField label="Confirm Password" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>) }} />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">Sign Up</Button>
          </Box>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}>Log In</Link></Typography>
        </Box>
      </Paper>
    </Container>
  );
}


