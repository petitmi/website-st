import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Badge,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  Card,
  CardMedia,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import {
  Close,
  ArrowBack,
  ShoppingCart,
  CheckCircle
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = ({ 
    onAddToCart,
    cartItems,
    setIsDrawerOpen
  }) => {  
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImage, setCurrentImage] = useState('front');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      console.log("PRODUCT DATA:", data);

      setProduct(data);
      // Set first variant with valid details as default
      const firstValidVariant = data.variants?.find(v => v.variety !== undefined) || data.variants?.[0];
      setSelectedVariant(firstValidVariant?.variety ?? null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setSnackbar({ open: true, message: 'Product not found', severity: 'error' });
      setLoading(false);
    }
  };
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleVariantChange = (variantId) => {
    setSelectedVariant(variantId);
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product);
      setSnackbar({ open: true, message: 'Added to inquiry cart!', severity: 'success' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Product not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const currentVariantData = product.variants?.find(v => v.variety === selectedVariant) || product.variants?.[0] || {};
  const hasDetails = currentVariantData.details && Object.keys(currentVariantData.details).length > 0;

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>

    {/* AppBar */}
    <AppBar position="sticky" sx={{ bgcolor: '#1e293b' }}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          🕶️ Funxter Wholesale
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

    {/* Page Content */}
    <Box sx={{ py: 4 }}>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{ px: { xs: 2, sm: 3, md: 6 } }}
        >

        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Box
        sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' }
        }}
        >
          {/* Left side - Images */}
          <Box sx={{ flex: 6 }}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'white' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <img
                  src={currentImage === 'front' ? currentVariantData.imageFront : currentVariantData.imageSide}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Card
                  onClick={() => setCurrentImage('front')}
                  sx={{
                    width: 120,
                    cursor: 'pointer',
                    border: currentImage === 'front' ? 2 : 1,
                    borderColor: currentImage === 'front' ? 'primary.main' : 'divider',
                    transition: 'all 0.2s'
                  }}
                >
                  <CardMedia
                    component="img"
                    image={currentVariantData.imageFront}
                    alt="Front view"
                    sx={{ height: 80, objectFit: 'contain', p: 1 }}
                  />
                </Card>
                <Card
                  onClick={() => setCurrentImage('side')}
                  sx={{
                    width: 120,
                    cursor: 'pointer',
                    border: currentImage === 'side' ? 2 : 1,
                    borderColor: currentImage === 'side' ? 'primary.main' : 'divider',
                    transition: 'all 0.2s'
                  }}
                >
                  <CardMedia
                    component="img"
                    image={currentVariantData.imageSide}
                    alt="Side view"
                    sx={{ height: 80, objectFit: 'contain', p: 1 }}
                  />
                </Card>
              </Box>
            </Paper>

            {/* Summary */}
            <Paper elevation={2} sx={{ p: 4, bgcolor: 'white', mt: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  per unit
                </Typography>
              </Box>

              {product.moq && (
                <Box sx={{ mb: 3 }}>
                  <Chip 
                    label={`MOQ: ${product.moq} units`} 
                    sx={{ bgcolor: '#e2e8f0', fontWeight: 'bold' }}
                  />
                </Box>
              )}

              {/* Color Variants */}
              {product.variants && product.variants.length > 1 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Available Colors
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {product.variants.map(variant => (
                      <Card
                        key={variant.variety}
                        onClick={() => handleVariantChange(variant.variety)}
                        sx={{
                          width: 100,
                          cursor: 'pointer',
                          border: selectedVariant === variant.variety ? 3 : 1,
                          borderColor: selectedVariant === variant.variety ? 'primary.main' : 'divider',
                          transition: 'all 0.2s',
                          '&:hover': { boxShadow: 4 }
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={variant.imageFront}
                          alt={variant.colorway || 'Variant'}
                          sx={{ height: 80, objectFit: 'contain', p: 1 }}
                        />
                        {variant.colorway && (
                          <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#f8fafc' }}>
                            <Typography variant="caption" fontWeight="bold">
                              {variant.colorway}
                            </Typography>
                          </Box>
                        )}
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {product.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                sx={{ 
                  bgcolor: '#1e293b', 
                  '&:hover': { bgcolor: '#0f172a' },
                  py: 1.5,
                  mb: 2
                }}
              >
                Add to Inquiry Cart
              </Button>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle sx={{ fontSize: 18, color: '#22c55e' }} />
                <Typography variant="body2" color="text.secondary">
                  Custom branding available
                </Typography>
              </Box>
            </Paper>
           </Box>
           
          {/* Right side - Specifications */}
          {hasDetails && (
            <Box sx={{ flex: 6 }}>
              <Paper elevation={2} sx={{ p: 4, bgcolor: 'white'}}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Product Specifications
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Basic Appearance */}
                {currentVariantData.details.basicAppearance && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Basic Appearance
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.basicAppearance).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%', border: 0 }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Frame Design */}
                {currentVariantData.details.frameDesign && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Frame Design
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.frameDesign).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%', border: 0 }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Lens Features */}
                {currentVariantData.details.lensFeatures && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Lens Features
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.lensFeatures).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%', border: 0 }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Material & Structure */}
                {currentVariantData.details.materialStructure && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Material & Structure
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.materialStructure).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%', border: 0 }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Wearing & Adaptation */}
                {currentVariantData.details.wearingAdaptation && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Wearing & Adaptation
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(currentVariantData.details.wearingAdaptation).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell sx={{ fontWeight: 'bold', width: '40%', border: 0 }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>{value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Usage Scenarios */}
                {currentVariantData.details.usageScenarios && (
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                      Usage Scenarios
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentVariantData.details.usageScenarios}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  </Box>
);
};

export default ProductDetail;