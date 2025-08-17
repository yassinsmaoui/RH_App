import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { useAppDispatch } from '../store/hooks'; // TEMPORAIREMENT COMMENTÉ
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { login } from '../store/slices/authSlice';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Hook standard au lieu de useAppDispatch
  const [error, setError] = useState('');
  const token = useSelector((state: any) => state.auth.token);

  console.log('Login component - token:', token);

  useEffect(() => {
    console.log('Login useEffect - token:', token);
    if (token) {
      console.log('Token trouvé, redirection vers dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Authentification temporaire simplifiée
        console.log('Login attempt:', values);
        
        // Comptes de test disponibles
        const testAccounts = [
          { email: 'admin@test.com', password: 'password', name: 'Administrateur' },
          { email: 'hr@test.com', password: 'password', name: 'RH Manager' },
          { email: 'celeste.yassine@gmail.com', password: 'password', name: 'Celeste Yassine' },
          { email: 'user@test.com', password: '123456', name: 'Utilisateur Test' }
        ];
        
        const user = testAccounts.find(acc => 
          acc.email === values.email && acc.password === values.password
        );
        
        if (user) {
          // Création d'un token temporaire
          const fakeToken = 'fake-jwt-token-' + Date.now();
          localStorage.setItem('token', fakeToken);
          
          // Simulation d'une action Redux pour mettre à jour le state
          // Dispatching a manual action to update Redux state
          dispatch({
            type: 'auth/login/fulfilled',
            payload: {
              access: fakeToken,
              user: {
                id: 1,
                email: user.email,
                name: user.name,
                is_active: true
              }
            }
          });
          
          console.log('Login réussi pour:', user.name);
          navigate('/dashboard');
        } else {
          setError('Email ou mot de passe incorrect');
        }
      } catch (err: any) {
        setError(err.message || err.detail || 'Login failed. Please check your credentials.');
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Se connecter
          </Typography>
          
          {/* Comptes de test disponibles */}
          <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Comptes de test disponibles :
            </Typography>
            <Typography variant="body2">
              • admin@test.com / password<br/>
              • hr@test.com / password<br/>
              • celeste.yassine@gmail.com / password<br/>
              • user@test.com / 123456
            </Typography>
          </Alert>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                textTransform: 'none',
                borderRadius: 2,
              }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <CircularProgress size={24} /> : 'Se connecter'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                Vous n'avez pas de compte ? Créer un compte
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;