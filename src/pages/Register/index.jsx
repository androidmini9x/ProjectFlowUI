import { Helmet } from 'react-helmet-async';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import RouterWrap from '../../route/components/routeWrapper';

const validationSchema = yup.object({
  firstname: yup
    .string('Enter first name')
    .min(3, 'First name should be of minimum 3 characters length')
    .required('First name is required'),
  lastname: yup
    .string('Enter last name')
    .min(3, 'Last name should be of minimum 3 characters length')
    .required('Last name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(5, 'Password should be of minimum 5 characters length')
    .required('Password is required'),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const register = async (body) => {
    const api = `${import.meta.env.VITE_API}/register`;

    try {
      setLoad(true);
      const req = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await req.json();
      if (req.status !== 201) {
        setError(data.error);
      } else if (req.status === 201) {
        setOpen(true);
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    } finally {
      setLoad(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    navigate('/login');
  };

  const formik = useFormik({
    initialValues: {
      firstname: 'Moe',
      lastname: 'Josk',
      email: 'dad@dad.com',
      password: '123456789',
    },
    validationSchema,
    onSubmit: (values) => {
      register(values);
    },
  });

  return (
    <>
      <Helmet>
        <title> Register | ProjectFlow </title>
      </Helmet>

      <Box sx={{ height: 1 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60 }}>
                <AccountTreeRoundedIcon />
              </Avatar>
            </Box>
            <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>
              Register to ProjectFlow
            </Typography>

            <Divider sx={{ my: 3 }} />
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                  {error}
                </Alert>
              )}
              {open && (
                <Alert severity="info" sx={{ my: 2 }}>
                  Rediceting to login page...
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstname"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstname && formik.errors.firstname}
                    helperText={
                      formik.touched.firstname && formik.errors.firstname
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    autoComplete="family-name"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.lastname && Boolean(formik.errors.lastname)
                    }
                    helperText={
                      formik.touched.lastname && formik.errors.lastname
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    id="password"
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>
              </Grid>

              <LoadingButton
                fullWidth
                loading={load}
                loadingIndicator="Register…"
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                sx={{ mt: 3 }}
              >
                Register
              </LoadingButton>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ mt: 3 }}
              >
                <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
                  Already have an account?
                  <Link
                    component={RouterWrap}
                    href="/login"
                    variant="subtitle2"
                    sx={{ ml: 0.5 }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Card>
        </Stack>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{
              width: '100%',
              backgroundColor: '#484848',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Account created successfully.
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
