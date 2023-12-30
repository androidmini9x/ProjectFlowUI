import { Helmet } from 'react-helmet-async';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
  task_name: yup
    .string('Enter your task name')
    .min(5, 'Task name should be of minimum 5 characters length')
    .required('Task name is required'),
  description: yup
    .string('Enter your task description')
    .min(10, 'Description should be of minimum 10 characters length')
    .required('Description is required'),
  start: yup.date().required('Start date is required'),
  end: yup.date().required('End date is required'),
});

function TaskEdit() {
  const { authed } = useContext(UserContext);
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { id, task_id } = useParams();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    navigate(`/project/${id}`);
  };

  const edit = async (values) => {
    const api = `${import.meta.env.VITE_API}/project/${id}/task/${task_id}`;

    try {
      setLoad(true);
      const req = await fetch(api, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
        body: JSON.stringify({
          name: values.task_name,
          description: values.description,
          start: values.start,
          end: values.end,
        }),
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
      task_name: '',
      description: '',
      start: undefined,
      end: undefined,
    },
    validationSchema,
    onSubmit: (values) => {
      edit(values);
    },
  });

  useEffect(() => {
    const api = `${import.meta.env.VITE_API}/project/${id}/task/${task_id}`;
    const get_task = async () => {
      const req = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
      });
      const data = await req.json();
      if (req.status === 200) {
        formik.setFieldValue('task_name', data.name);
        formik.setFieldValue('description', data.description);
        formik.setFieldValue('start', data.start);
        formik.setFieldValue('end', data.end);
      }
    };
    get_task();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, task_id, authed.token]);

  return (
    <>
      <Helmet>
        <title>Edit Task</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Edit Task</Typography>
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
            <CardHeader title="Task" sx={{ mb: 2 }} />
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
                    name="task_name"
                    label="Task Name"
                    value={formik.values.task_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.task_name &&
                      Boolean(formik.errors.task_name)
                    }
                    helperText={
                      formik.touched.task_name && formik.errors.task_name
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

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="Start"
                    label="Start Date"
                    name="start"
                    type="date"
                    value={formik.values.start}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.start && Boolean(formik.errors.start)}
                    helperText={formik.touched.start && formik.errors.start}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="End"
                    label="End date"
                    name="end"
                    type="date"
                    value={formik.values.end}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.end && Boolean(formik.errors.end)}
                    helperText={formik.touched.end && formik.errors.end}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <LoadingButton
                fullWidth
                loading={load}
                loadingIndicator="Save..."
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
            Task edited successfully.
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default TaskEdit;
