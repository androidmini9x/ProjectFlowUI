import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import UserContext from '../../context/store';
import AppWidgetSummary from './components/AppWidgetSummary';
import AppTasks from './components/AppTasks';
import AppOrderTimeline from './components/AppOrderTimeline';

function Home() {
  const [projects, setProject] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [fetched, setFetch] = useState(false);
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
      setFetch(true);
    };
    getProject();
  }, [authed.token]);

  useEffect(() => {
    const getTasks = async () => {
      const api = import.meta.env.VITE_API;
      const req = await fetch(`${api}/project/tasks/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
      });
      const data = await req.json();
      if (req.status === 200) {
        setTasks(data);
      }
    };
    getTasks();
  }, [authed.token]);

  return (
    <>
      <Helmet>
        <title> Dashboard | Project Flow </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>

        <Grid container spacing={3}>
          <Grid xs={12} sm={6}>
            <AppWidgetSummary
              title="Projects you are mange"
              total={projects.filter((e) => e.owner === authed.user._id).length}
              color="success"
              icon={<img alt="icon" src="/assets/icons/ic_glass_bag.png" />}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <AppWidgetSummary
              title="Projects you are participating with"
              total={projects.filter((e) => e.owner !== authed.user._id).length}
              color="info"
              icon={<img alt="icon" src="/assets/icons/ic_glass_users.png" />}
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AppTasks title="Today Tasks" list={tasks} fetched={fetched} />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Upcoming Tasks"
              list={tasks}
              fetched={fetched}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Home;
