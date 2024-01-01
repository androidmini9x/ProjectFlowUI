import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

function Loading() {
  return (
    <Backdrop open="true" sx={{ backgroundColor: 'white' }}>
      <Stack
        sx={{
          width: { xs: '100%', md: '50%', lg: '40%' },
          color: 'grey.500',
          textAlign: 'center',
          p: 2,
        }}
        spacing={2}
      >
        <Typography>Loading</Typography>
        <LinearProgress color="secondary" />
      </Stack>
    </Backdrop>
  );
}

export default Loading;
