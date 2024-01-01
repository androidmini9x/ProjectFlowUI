import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import UndoIcon from '@mui/icons-material/Undo';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import ListItemText from '@mui/material/ListItemText';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import UserContext from '../../context/store';

function Invitation() {
  const { authed } = useContext(UserContext);
  const [invitation, setInvitation] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const api = `${import.meta.env.VITE_API}/invitations`;
        const req = await fetch(api, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': authed.token,
          },
        });
        const data = await req.json();
        if (req.status === 200) {
          setInvitation(data);
        }
      } catch (err) {
        console.log('Error:', err);
      }
    };
    fetchDate();
  }, [authed.token]);

  const acceptInvite = async (token) => {
    const api = `${import.meta.env.VITE_API}/project/invitation/${token}`;
    try {
      const req = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
      });
      const data = await req.json();
      if (req.status !== 200) {
        setError(data.error);
      } else if (req.status === 200) {
        setInvitation(invitation.filter((e) => e.token !== token));
        setSuccess(data.message);
        setOpen(true);
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    }
  };

  const rejectInvite = () => {};

  return (
    <>
      <Helmet>
        <title>Recived Invitation</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Recived Initation</Typography>
        </Stack>
        <Grid>
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {invitation.length === 0 && (
              <Alert severity="info" sx={{ m: 3 }}>
                You don&#39;t have any invitation.
              </Alert>
            )}
            {invitation.map((value) => (
              <ListItem
                key={value}
                secondaryAction={
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      color="success"
                      endIcon={<ThumbUpOffAltIcon />}
                      onClick={() => acceptInvite(value.token)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<UndoIcon />}
                      onClick={() => rejectInvite(value.token)}
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                }
                disablePadding
              >
                <ListItemText
                  sx={{ px: 3 }}
                  primary={
                    <Typography variant="h6" component="h2">
                      {value.name}
                    </Typography>
                  }
                  secondary={`You've been invited to participating in ${value.name} project`}
                />
              </ListItem>
            ))}
          </List>
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

export default Invitation;
