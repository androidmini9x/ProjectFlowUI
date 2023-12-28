import { Helmet } from 'react-helmet-async';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';

import UserContext from '../../context/store';

import RouterWrap from '../../route/components/routeWrapper';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(5, 'Password should be of minimum 5 characters length')
    .required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { handleAuth } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);

  const signIn = async (body) => {
    const api = import.meta.env.VITE_API;

    try {
      setLoad(true);
      const req = await fetch(`${api}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await req.json();
      if (req.status !== 200) {
        setError(data.error);
      } else if (req.status === 200) {
        const req2 = await fetch(`${api}/info`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': data.token,
          },
        });
        const user = await req2.json();
        if (req.status === 200) {
          handleAuth(data.token, user);
          navigate('/');
        } else {
          setError('Failed to connect to the Server');
        }
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    } finally {
      setLoad(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: 'ahmed@google.com',
      password: '123456789',
    },
    validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      signIn(values);
    },
  });

  return (
    <>
      <Helmet>
        <title> Login | ProjectFlow </title>
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
              Sign in to ProjectFlow
            </Typography>

            <Divider sx={{ my: 3 }} />
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                  {error}
                </Alert>
              )}
              <Stack spacing={3}>
                <TextField
                  name="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Stack>

              <LoadingButton
                fullWidth
                loading={load}
                loadingIndicator="Login…"
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                sx={{ mt: 3 }}
              >
                Login
              </LoadingButton>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ mt: 3 }}
              >
                <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
                  Don’t have an account?
                  <Link
                    component={RouterWrap}
                    href="/register"
                    variant="subtitle2"
                    sx={{ ml: 0.5 }}
                  >
                    Get started
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Card>
        </Stack>
      </Box>
    </>
  );
}
