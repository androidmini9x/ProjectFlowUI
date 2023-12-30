import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RouteWrap from '../../../route/components/routeWrapper';

// ----------------------------------------------------------------------

export default function AnalyticsTasks({
  title,
  subheader,
  list,
  fetched,
  ...other
}) {
  const filterTask = list.filter((e) => {
    const start = new Date(`${e.task.start} 00:00:00`);
    const end = new Date(`${e.task.end} 23:59:55`);
    const today = new Date();
    return today >= start && today <= end;
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {fetched && filterTask.length === 0 && (
        <Typography
          variant="body1"
          sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}
        >
          There is no Task to do Today.
        </Typography>
      )}

      {filterTask.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Card>
  );
}

AnalyticsTasks.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
  fetched: PropTypes.bool,
};

// ----------------------------------------------------------------------

function TaskItem({ task }) {
  return (
    <Stack
      direction="row"
      sx={{
        pl: 4,
        pr: 1,
        py: 1,
        '&:not(:last-of-type)': {
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        },
      }}
    >
      <Avatar sx={{ bgcolor: green[500] }} variant="rounded">
        <AssignmentIcon />
      </Avatar>
      <Box sx={{ width: '100%', mx: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Link
              component={RouteWrap}
              href={`/project/${task.task.project_id}/task/${task.task._id}`}
              color="inherit"
              variant="subtitle2"
              underline="hover"
              noWrap
            >
              <Typography>{task.task.name}</Typography>
            </Link>
            <Typography variant="caption">
              {`Project: ${task.project_name}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>{task.task.end}</Typography>
            <Typography variant="caption" textAlign="right" component="div">
              End Date
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object,
};
