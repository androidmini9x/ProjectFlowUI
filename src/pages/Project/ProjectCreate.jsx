import { Helmet } from 'react-helmet-async';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

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
import LoadingButton from '@mui/lab/LoadingButton';

import UserContext from '../../context/store';

const validationSchema = yup.object({
  project_name: yup
    .string('Enter your project name')
    .min(5, 'Project name should be of minimum 5 characters length')
    .required('Project name is required'),
  description: yup
    .string('Enter your project description')
    .min(10, 'Description should be of minimum 10 characters length')
    .required('Description is required'),
});

function ProjectCreate() {
  const { authed } = useContext(UserContext);
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    navigate('/project');
  };

  const createProject = async (values) => {
    const api = `${import.meta.env.VITE_API}/project/create`;

    try {
      setLoad(true);
      const req = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
        body: JSON.stringify(values),
      });
      const data = await req.json();
      if (req.status !== 200) {
        setError(data.error);
      } else if (req.status === 200) {
        setOpen(true);
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    } finally {
      setLoad(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      project_name: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      createProject({
        name: values.project_name,
        description: values.description,
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>Create New Projects</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Create New Project</Typography>
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
            <CardHeader title="Project" sx={{ mb: 2 }} />
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
                    name="project_name"
                    label="Project Name"
                    value={formik.values.project_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.project_name &&
                      Boolean(formik.errors.project_name)
                    }
                    helperText={
                      formik.touched.project_name && formik.errors.project_name
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                </Grid>
              </Grid>
              <LoadingButton
                fullWidth
                loading={load}
                loadingIndicator="Create..."
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                sx={{ mt: 3 }}
              >
                Create
              </LoadingButton>
            </Box>
          </Card>
        </Grid>

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
            Project created successfully.
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default ProjectCreate;
