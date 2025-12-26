import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Container,
  Drawer,
  IconButton,
  Badge,
  TextField,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
  Chip,
  Paper
} from '@mui/material';
import {
  ShoppingCart,
  Close,
  Add,
  Remove,
  Delete,
  Send,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const products = [
    { id: 1, name: 'Classic Aviator', price: 45, image: '🕶️', description: 'Timeless aviator design', moq: 50 },
    { id: 2, name: 'Retro Round', price: 38, image: '🥽', description: 'Vintage round frames', moq: 50 },
    { id: 3, name: 'Sport Shield', price: 52, image: '🕶️', description: 'Performance sports design', moq: 100 },
    { id: 4, name: 'Cat Eye Glam', price: 42, image: '😎', description: 'Elegant cat eye style', moq: 50 },
    { id: 5, name: 'Wayfarer Classic', price: 48, image: '🕶️', description: 'Iconic wayfarer shape', moq: 50 },
    { id: 6, name: 'Oversized Square', price: 55, image: '🥽', description: 'Bold square frames', moq: 75 },
    { id: 7, name: 'Polarized Pilot', price: 65, image: '🕶️', description: 'Premium polarized lenses', moq: 100 },
    { id: 8, name: 'Mirrored Sport', price: 58, image: '😎', description: 'Reflective sport lenses', moq: 100 },
  ];

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setIsDrawerOpen(true);
  };

  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }
    alert('Thank you! We will contact you shortly with a quote.');
    setCartItems([]);
    setIsDrawerOpen(false);
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ bgcolor: '#1e293b' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🕶️ SunStyle Wholesale
          </Typography>
          <Button
            color="inherit"
            startIcon={
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCart />
              </Badge>
            }
            onClick={() => setIsDrawerOpen(true)}
            variant="outlined"
            sx={{ borderColor: 'white' }}
          >
            Contact Me
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: '#334155', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
            Wholesale & Custom Sunglasses
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: '#cbd5e1', mb: 4 }}>
            Quality eyewear for retailers and brands worldwide
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Chip label="Low MOQ Options" sx={{ bgcolor: '#22c55e', color: 'white' }} />
            <Chip label="Custom Branding" sx={{ bgcolor: '#22c55e', color: 'white' }} />
            <Chip label="Fast Turnaround" sx={{ bgcolor: '#22c55e', color: 'white' }} />
          </Box>
        </Container>
      </Box>

      {/* Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
          Our Collection
        </Typography>
        <Grid container spacing={4}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6 } }}>
                <CardMedia
                  sx={{
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f1f5f9',
                    fontSize: '5rem'
                  }}
                >
                  {product.image}
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        ${product.price}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        per unit
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        MOQ
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {product.moq} units
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' } }}
                    onClick={() => addToCart(product)}
                  >
                    Add to Inquiry
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Company Info Footer */}
      <Box sx={{ bgcolor: '#1e293b', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                About Us
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                SunStyle Wholesale has been supplying premium sunglasses to retailers and brands worldwide for over 15 years. We specialize in wholesale distribution and custom manufacturing solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Our Services
              </Typography>
              <List dense>
                {['Wholesale Distribution', 'Custom Branding & Packaging', 'Private Label Manufacturing', 'Design Consultation', 'Quality Assurance'].map((service) => (
                  <ListItem key={service} disableGutters>
                    <ListItemText primary={`• ${service}`} sx={{ color: '#cbd5e1' }} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, color: '#cbd5e1' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" />
                  <Typography variant="body2">sales@sunstyle.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">+1 (236) 123-4567</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2">123 Vancouver St, V5R6B7</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, bgcolor: '#475569' }} />
          <Typography variant="body2" align="center" sx={{ color: '#94a3b8' }}>
            © 2024 SunStyle Wholesale. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Contact Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 500 } }
        }}
      >
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Inquiry Cart
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3, overflow: 'auto', flexGrow: 1 }}>
          {/* Cart Items */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Selected Products
          </Typography>
          {cartItems.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', my: 2 }}>
              <Typography color="text.secondary">No items added yet</Typography>
            </Paper>
          ) : (
            <List>
              {cartItems.map(item => (
                <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ fontSize: '2.5rem' }}>{item.image}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price} per unit
                      </Typography>
                    </Box>
                    <ButtonGroup size="small">
                      <Button onClick={() => updateQuantity(item.id, -1)}>
                        <Remove fontSize="small" />
                      </Button>
                      <Button disabled>{item.quantity}</Button>
                      <Button onClick={() => updateQuantity(item.id, 1)}>
                        <Add fontSize="small" />
                      </Button>
                    </ButtonGroup>
                    <IconButton color="error" onClick={() => removeItem(item.id)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </List>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Contact Form */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Your Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email Address"
              type="email"
              required
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone Number"
              type="tel"
              required
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Company Name (Optional)"
              fullWidth
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <TextField
              label="Additional Details"
              multiline
              rows={4}
              fullWidth
              placeholder="Quantities, customization needs, etc."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Send />}
              onClick={handleSubmit}
              sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, mt: 2 }}
            >
              Submit Inquiry
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default App;