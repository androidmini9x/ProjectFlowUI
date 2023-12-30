import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import UserContext from '../../context/store';

const validationSchema = yup.object({
  comment: yup
    .string('Enter your Comment')
    .min(12, 'Comment should be of minimum 12 characters length')
    .required('Comment is required'),
});

function TaskDetail() {
  const { authed } = useContext(UserContext);
  const { id, task_id } = useParams();
  const [error, setError] = useState('');
  const [task, setTask] = useState(null);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const createComment = async (values) => {
    const api = `${
      import.meta.env.VITE_API
    }/project/${id}/task/${task_id}/info`;

    try {
      setLoad(true);
      const req = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
        body: JSON.stringify({ ...values }),
      });
      const data = await req.json();
      if (req.status !== 200) {
        setError(data.error);
      } else if (req.status === 200) {
        setOpen(true);
        setTask((prev) => ({
          ...prev,
          comments: [
            ...prev.comments,
            {
              id: data.comment_id,
              created_at: new Date(),
              user_id: authed.user._id,
              task_id,
              user: {
                firstname: authed.user.firstname,
                lastname: authed.user.lastname,
                email: authed.user.email,
              },
              text: values.comment,
            },
          ],
        }));
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    } finally {
      setLoad(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      comment: '',
    },
    validationSchema,
    onSubmit: (values) => {
      createComment(values);
    },
  });

  useEffect(() => {
    const api = `${
      import.meta.env.VITE_API
    }/project/${id}/task/${task_id}/info`;
    const get_task = async () => {
      try {
        const req = await fetch(api, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': authed.token,
          },
        });
        if (req.status === 200) {
          const data = await req.json();
          setTask(data);
        }
      } catch (err) {
        setError(err);
      }
    };
    get_task();
  }, [id, task_id, authed.token]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (task === null) {
    return (
      <Typography variant="body1" sx={{ p: 4, color: 'text.secondary' }}>
        Loading...
      </Typography>
    );
  }

  return (
    <>
      <Helmet>
        <title> Task | Project Flow </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container justifyContent="center" spacing={3}>
          <Grid xs={12} md={12} lg={9}>
            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}
            <Card>
              <CardHeader title={task.name} />
              <Box sx={{ m: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ p: 4, color: 'text.secondary' }}
                >
                  {task.description}
                </Typography>
                <Grid
                  item
                  xs={12}
                  component="form"
                  onSubmit={formik.handleSubmit}
                >
                  <TextField
                    fullWidth
                    id="comment"
                    label="Comment"
                    name="comment"
                    multiline
                    rows={3}
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.comment && Boolean(formik.errors.comment)
                    }
                    helperText={formik.touched.comment && formik.errors.comment}
                  />
                  <LoadingButton
                    fullWidth
                    loading={load}
                    loadingIndicator="Posting..."
                    size="large"
                    type="submit"
                    variant="contained"
                    color="inherit"
                    sx={{ mt: 3 }}
                  >
                    Post
                  </LoadingButton>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} md={12} lg={9}>
            <Box>
              <Timeline
                sx={{
                  m: 0,
                  p: 3,
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                  [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.1,
                  },
                }}
              >
                {task.comments.map((item) => (
                  <TimelineItem>
                    <TimelineOppositeContent
                      sx={{ m: 'auto 0' }}
                      align="right"
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(item.created_at).toLocaleString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          item.user_id === task.owner ? 'error' : 'secondary'
                        }
                      />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent
                      sx={{
                        py: '12px',
                        px: 2,
                        m: 1,
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                      }}
                    >
                      <Typography variant="h6" component="span">
                        {`${item.user.firstname} ${item.user.lastname}`}
                      </Typography>
                      <Typography>{item.text}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
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
            Comment created successfully.
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default TaskDetail;
