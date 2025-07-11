// HomePage.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Slide,
  IconButton
} from '@mui/material';
import { Facebook, Twitter, Instagram, ForkLeft, Margin } from '@mui/icons-material';
import { Link, Navigate, useNavigate } from 'react-router-dom';

/** 
 * A simple "mock" logout function. 
 * Replace with real logic if you have authentication in place.
 */
function useAuth() {
  const logout = () => {
    console.log('Logged out!');
  };
  return { logout };
}

/** 
 * NavBar component: 
 * - Smaller height
 * - Logo on the far left
 * - Nav buttons on the far right
 */
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


/**
 * HomePage component 
 * - Hero section with "Herobackground.jpg"
 * - Welcome message + buttons on the left in black text
 * - Quotes, Gallery, Features, Footer remain
 */
export default function HomePage() {
  return (
    <>
      {/* NavBar at the top */}
      <NavBar />

      {/* HERO SECTION (no overlay, text in black, left-aligned) */}
      <Box
        sx={{
          width: '100%',
          minHeight: '60vh',
          background: "url('/Herobackground.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          // Force text container to the left
          justifyContent: 'flex-start',
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            textAlign: 'left', 
            color: '#000', 
            py: 8 
          }}
        >
          <Fade in={true} timeout={1200}>
            <Box>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
                Welcome to FoodSave
              </Typography>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Together, we can reduce food waste and help our communities.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF9800',
                  color: '#fff',
                  mr: 2,
                  '&:hover': { backgroundColor: '#fb8c00' }
                }}
                size="large"
                component={Link}
                to="/donate"
              >
                DONATE FOOD
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#FF9800',
                  color: '#FF9800',
                  '&:hover': {
                    borderColor: '#fb8c00',
                    color: '#fb8c00'
                  }
                }}
                size="large"
                component={Link}
                to="/request"
              >
                REQUEST FOOD
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* QUOTES SECTION */}
      <Box sx={{ py: 6, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Slide direction="up" in={true} mountOnEnter timeout={800}>
            <Box >
              <Typography
                variant="h4"
                fontWeight="bold"
                align="center"
                sx={{ color: '#212121', mb: 4 }}
              >
                Inspiring Quotes
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ backgroundColor: '#C8E6C9', p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      “Waste is not just a problem, it’s an opportunity.”
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      - Unknown
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ backgroundColor: '#C8E6C9', p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      “One person’s excess can be another’s lifeline.”
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      - FoodSave
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ backgroundColor: '#C8E6C9', p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      “The world produces enough food to feed everyone.”
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      - United Nations
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ backgroundColor: '#C8E6C9', p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      “Save food, save lives, save our planet and environment.”
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      - FoodSave
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Slide>
        </Container>
      </Box>

      {/* IMAGE GALLERY SECTION (4 images) */}
      <Box sx={{ py: 6, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Fade in={true} timeout={1200}>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                align="center"
                sx={{ color: '#212121', mb: 4 }}
              >
                Our Community in Action
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image="/savefood1.img.jpg"
                      alt="Community image 1"
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image="/savefood3.img.jpg"
                      alt="Community image 2"
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image="/savefood4.img.jpg"
                      alt="Community image 3"
                    />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image="/savefood5.img.jpg"
                      alt="Community image 4"
                    />
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* FEATURES SECTION (4 cards), background #f5f5f5 */}
      <Box sx={{ py: 6, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Slide direction="up" in={true} mountOnEnter timeout={1000}>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                align="center"
                sx={{ color: '#212121', mb: 4 }}
              >
                Why Use FoodSave?
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Reduce Waste
                      </Typography>
                      <Typography variant="body2">
                        We help redirect surplus food from landfills to those in need, 
                        protecting the environment.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Community Impact
                      </Typography>
                      <Typography variant="body2">
                        Support local shelters, food banks, and vulnerable communities 
                        in your area.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Easy to Use
                      </Typography>
                      <Typography variant="body2">
                        Simple donation process, real-time tracking, and 
                        ML-based categorization of food items.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Sustainability
                      </Typography>
                      <Typography variant="body2">
                        Conserve resources and reduce carbon footprint by 
                        ensuring perfectly edible food doesn’t go to waste.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Slide>
        </Container>
      </Box>

      {/* PROFESSIONAL FOOTER */}
      <Box
        sx={{
          backgroundColor: '#2E7D32', // Dark green
          color: '#fff',
          py: 4,
          mt: 4,
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={4}>
            {/* Column 1: Logo + Description */}
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <img
                  src="/FoodSave.Logo.png"
                  alt=""
                  style={{ width: 60, marginRight: 8 }}
                />
                <Typography variant="h6" fontWeight="bold">
                  FoodSave
                </Typography>
              </Box>
              <Typography variant="body2">
                Connecting surplus food with those who need it most, 
                one donation at a time.
              </Typography>
            </Grid>
            {/* Column 2: Quick Links */}
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link to="/home" style={{ color: '#fff', textDecoration: 'none' }}>
                  Home
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link to="/donate" style={{ color: '#fff', textDecoration: 'none' }}>
                  Donate
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link to="/request" style={{ color: '#fff', textDecoration: 'none' }}>
                  Request
                </Link>
              </Typography>
            </Grid>
            {/* Column 3: Social Media */}
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Follow Us
              </Typography>
              <Box>
                <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#fff' }}>
                  <Facebook />
                </IconButton>
                <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#fff' }}>
                  <Twitter />
                </IconButton>
                <IconButton href="https://instagram.com" target="_blank" sx={{ color: '#fff' }}>
                  <Instagram />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Box mt={4} textAlign="center">
            <Typography variant="body2">
              © 2025 FoodSave | All rights reserved
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
