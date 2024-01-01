/* eslint-disable no-unused-vars */
import { Helmet } from 'react-helmet-async';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useState, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import UserContext from '../../context/store';

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
});

function Profile() {
  const { authed } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [load, setLoad] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      //   alert(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    const get_info = async () => {
      const api = import.meta.env.VITE_API;
      const req = await fetch(`${api}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
      });
      const data = await req.json();
      if (req.status === 200) {
        formik.setFieldValue('firstname', data.firstname);
        formik.setFieldValue('lastname', data.lastname);
        formik.setFieldValue('email', data.email);
      }
    };
    get_info();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed.token]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Profile</Typography>
        </Stack>
        <Grid xs={12} md={6} lg={8}>
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          {open && (
            <Alert severity="info" sx={{ my: 2 }}>
              Rediceting to projects page...
            </Alert>
          )}
          <Card>
            <CardHeader title="User Information" sx={{ mb: 2 }} />
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ my: 4, px: 6 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="firstname"
                    label="Firstname"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.firstname &&
                      Boolean(formik.errors.firstname)
                    }
                    helperText={
                      formik.touched.firstname && formik.errors.firstname
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="lastname"
                    label="Lastname"
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
                    fullWidth
                    name="email"
                    label="Email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
              </Grid>
              <LoadingButton
                fullWidth
                loading={load}
                loadingIndicator="Saving..."
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                sx={{ mt: 3 }}
              >
                Save
              </LoadingButton>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={{ mt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          {open && (
            <Alert severity="info" sx={{ my: 2 }}>
              Rediceting to projects page...
            </Alert>
          )}
          <Card>
            <CardHeader title="Change Password" sx={{ mb: 2 }} />
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ my: 4, px: 6 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="New Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
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
                  />
                </Grid>
              </Grid>
              <LoadingButton
                fullWidth
                loading={load}
                loadingIndicator="Change..."
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                sx={{ mt: 3 }}
              >
                Change
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
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
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default Profile;
