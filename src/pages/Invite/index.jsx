import { Helmet } from 'react-helmet-async';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import UndoIcon from '@mui/icons-material/Undo';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { deepOrange } from '@mui/material/colors';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

import UserContext from '../../context/store';

const validationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email'),
});

function Invite() {
  const { authed } = useContext(UserContext);

  const { id } = useParams();

  const [team, setTeam] = useState([]);
  const [invitation, setInvitation] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const api = `${import.meta.env.VITE_API}/project/${id}`;
        const req = await fetch(`${api}/teams`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': authed.token,
          },
        });
        const data = await req.json();
        if (req.status === 200) {
          setTeam(data);
        }
        const req2 = await fetch(`${api}/invitation`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': authed.token,
          },
        });
        const data2 = await req2.json();
        if (req2.status === 200) {
          setInvitation(data2);
        }
      } catch (err) {
        console.log('Error:', err);
      }
    };
    fetchDate();
  }, [authed.token, id]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const invite = async (email) => {
    const api = `${import.meta.env.VITE_API}/project/${id}/invite`;
    try {
      const req = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
        body: JSON.stringify({ email }),
      });
      const data = await req.json();
      if (req.status !== 200) {
        setError(data.error);
      }
      if (req.status === 200) {
        setInvitation((prev) => [...prev, data]);
        setSuccess(data.message);
        setOpen(true);
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    }
  };

  const handleRevoke = async (inv_token) => {
    const api = `${import.meta.env.VITE_API}/project/invitation/${inv_token}`;
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
        setError('error');
      } else if (req.status === 200) {
        setInvitation(invitation.filter((e) => e.token !== inv_token));
        setSuccess(data.message);
        setOpen(true);
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      invite(values.email);
      resetForm();
    },
  });

  return (
    <>
      <Helmet>
        <title>Invite to Project</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Invite</Typography>
        </Stack>
        <Grid xs={12} md={6} lg={8}>
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          <Card>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box noValidate sx={{ my: 4, px: 6 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Enter Member Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <Button
                            variant="contained"
                            type="submit"
                            color="inherit"
                            startIcon={<PersonAddRoundedIcon />}
                          />
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <List
                    dense
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                  >
                    {team.map((user) => (
                      <ListItem
                        key={user._id}
                        secondaryAction={
                          <IconButton aria-label="comment">
                            <GroupRemoveIcon />
                          </IconButton>
                        }
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: deepOrange[500] }}>
                              {`${user.firstname.charAt(
                                0,
                              )}${user.lastname.charAt(0)}`}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${user.firstname} ${user.lastname} (${user.email})`}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid sx={{ mt: 4 }}>
          <Card>
            <CardHeader title="Panding Invitation" sx={{ mb: 2 }} />
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ my: 4, px: 6 }}
            >
              <Grid container spacing={2}>
                <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {invitation.map((user) => (
                    <ListItem
                      key={user._id}
                      secondaryAction={
                        <IconButton
                          aria-label="comment"
                          onClick={() => handleRevoke(user.token)}
                        >
                          <UndoIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: deepOrange[500] }}>
                            {`${user.firstname.charAt(0)}${user.lastname.charAt(
                              0,
                            )}`}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user.firstname} ${user.lastname} (${user.email})`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
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
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default Invite;
