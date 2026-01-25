import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Badge,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
  
} from '@mui/material';
import {
  ShoppingCart,
} from '@mui/icons-material';

const ProductList = ({ 
  cartItems, 
  setIsDrawerOpen, 
  addToCart
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchContactInfo();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (!response.ok) throw new Error('Failed to fetch contact info');
      const data = await response.json();
      setContactInfo(data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ bgcolor: '#1e293b' }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🕶️ {contactInfo?.companyName || 'Funxter Wholesale'}
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

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold" sx={{ mb: 6 }}>
          Our Collection
        </Typography>
        {products.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc' }}>
            <Typography variant="h6" color="text.secondary">No products available</Typography>
          </Paper>
        ) : (
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            {products.map(product => (
              <Card 
                key={product.id}
                sx={{ 
                  width: { 
                    xs: '100%', 
                    sm: 'calc(50% - 12px)', 
                    md: 'calc(25% - 18px)' 
                  },
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': { 
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  } 
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <Box
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  sx={{
                    height: 240,
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                  }}
                >
                  <Box
                    component="img"
                    src={hoveredProduct === product.id ? product.imageSide : product.imageFront}
                    alt={product.name}
                    sx={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    fontWeight="bold" 
                    sx={{ 
                      mb: 1.5,
                      fontSize: '1.1rem',
                      lineHeight: 1.3
                    }}
                  >
                    {product.name}
                  </Typography>
                  {product.colorway && (
                    <Chip 
                      label={product.colorway} 
                      size="small" 
                      sx={{ 
                        mb: 2, 
                        bgcolor: '#e2e8f0', 
                        fontSize: '0.75rem',
                        alignSelf: 'flex-start'
                      }} 
                    />
                  )}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2.5, 
                      flexGrow: 1,
                      lineHeight: 1.7,
                      fontSize: '0.95rem'
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
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
                <CardActions sx={{ p: 2.5, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ 
                      bgcolor: '#1e293b', 
                      '&:hover': { bgcolor: '#0f172a' },
                      py: 1.2,
                      fontWeight: 600
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Inquiry
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Container>

    </Box>
  );
};

export default ProductList;