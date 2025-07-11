// src/components/NavBar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate(); // ✅ Use navigate instead of useAuth

  const handleLogout = () => {
    localStorage.clear(); // ✅ Clear token and user data
    navigate("/login"); // ✅ Redirect to login page
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <img src="/logo.png" alt="FoodSave Logo" style={{ width: 40, marginRight: 16 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>FoodSave</Typography>
        <Button color="inherit" component={Link} to="/home">Home</Button>
        <Button color="inherit" component={Link} to="/donate">Donate</Button>
        <Button color="inherit" component={Link} to="/request">Request</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
