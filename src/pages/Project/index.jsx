import { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import UserContext from '../../context/store';
import ProjectList from './components/ProjectList';
import RouteWrap from '../../route/components/routeWrapper';

function Project() {
  const [projects, setProject] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(null);
  const { authed } = useContext(UserContext);

  useEffect(() => {
    const getProject = async () => {
      const api = import.meta.env.VITE_API;
      const req = await fetch(`${api}/project`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
      });
      const data = await req.json();
      if (req.status === 200) {
        setProject(data);
      }
    };
    getProject();
  }, [authed.token]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(null);
  };

  const deleteProject = async (id) => {
    const api = `${import.meta.env.VITE_API}/project/${id}`;

    try {
      const req = await fetch(api, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
      });
      const data = await req.json();
      if (req.status !== 200) {
        setOpen('error');
        setSuccess(data.error);
      } else if (req.status === 200) {
        setProject(projects.filter((e) => e._id !== id));
        setSuccess(data.message);
        setOpen('success');
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    }
  };

  const leaveProject = async (id) => {
    const api = `${import.meta.env.VITE_API}/project/${id}/teams`;

    try {
      const req = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
      });
      const data = await req.json();
      if (req.status !== 200) {
        setOpen('error');
        setError(data.error);
      } else if (req.status === 200) {
        setProject(projects.filter((e) => e._id !== id));
        setSuccess(data.message);
        setOpen('success');
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    }
  };

  return (
    <>
      <Helmet>
        <title> Projects | ProjectFlow </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Projects</Typography>

          <Button
            component={RouteWrap}
            href="/project/create"
            variant="contained"
            color="inherit"
            startIcon={<AddRoundedIcon />}
          >
            New Project
          </Button>
        </Stack>
        <Grid xs={12} md={6} lg={8}>
          <ProjectList
            title="You Project"
            list={projects
              .filter((e) => e.owner === authed.user._id)
              .map((proj) => ({
                id: proj._id,
                title: proj.name,
                description: proj.description,
                postedAt: null,
              }))}
            handleDelete={deleteProject}
            owner
          />
        </Grid>
        <Grid xs={12} md={6} lg={8} sx={{ mt: 4 }}>
          <ProjectList
            title="Team Project"
            list={projects
              .filter((e) => e.owner !== authed.user._id)
              .map((proj) => ({
                id: proj._id,
                title: proj.name,
                description: proj.description,
              }))}
            owner={false}
            handleLeave={leaveProject}
          />
        </Grid>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={open === 'error' ? 'error' : 'success'}
            sx={{ width: '100%', fontWeight: 'bold' }}
          >
            {open === 'error' ? error : success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default Project;
