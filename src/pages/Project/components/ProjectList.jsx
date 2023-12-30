import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { deepPurple } from '@mui/material/colors';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

import RouteWrap from '../../../route/components/routeWrapper';

export default function ProjectList({
  title,
  subheader,
  list,
  handleDelete,
  handleLeave,
  owner,
  ...other
}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Divider sx={{ borderStyle: 'dashed' }} />

      {list.length === 0 && (
        <Alert severity="info" sx={{ m: 3 }}>
          You don&apost have any Project Here.
        </Alert>
      )}

      <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
        {list.map((project) => (
          <NewsItem
            key={project.id}
            project={project}
            deleteItem={handleDelete}
            leaveProject={handleLeave}
            owner={owner}
          />
        ))}
      </Stack>
    </Card>
  );
}

ProjectList.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  owner: PropTypes.bool,
  list: PropTypes.array.isRequired,
  handleDelete: PropTypes.func,
  handleLeave: PropTypes.func,
};

// ----------------------------------------------------------------------

function NewsItem({ project, owner, deleteItem, leaveProject }) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    console.info('EDIT', project.id);
  };

  const handleDelete = () => {
    handleCloseMenu();
    deleteItem(project.id);
    console.info('DELETE', project.id);
  };

  const handleLeave = () => {
    handleCloseMenu();
    leaveProject(project.id);
    console.info('Leave', project.id);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: deepPurple[500] }}>
          {`${project.title.charAt(0).toUpperCase()}`}
        </Avatar>

        <Box sx={{ minWidth: 240, flexGrow: 1 }}>
          <Link
            component={RouteWrap}
            href={`/project/${project.id}`}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            noWrap
          >
            {project.title}
          </Link>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {project.description}
          </Typography>
        </Box>

        <Box sx={{ pr: 3 }}>
          <IconButton
            color={open ? 'inherit' : 'default'}
            onClick={handleOpenMenu}
          >
            <MoreVertRoundedIcon />
          </IconButton>
        </Box>
      </Stack>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {owner === true ? (
          <>
            <MenuItem onClick={handleEdit}>
              <EditNoteRoundedIcon />
              <Link
                component={RouteWrap}
                href={`/project/${project.id}/edit`}
                color="inherit"
                variant="subtitle2"
                underline="hover"
                noWrap
              >
                Edit
              </Link>
            </MenuItem>

            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteForeverRoundedIcon />
              Delete
            </MenuItem>
          </>
        ) : (
          <MenuItem sx={{ color: 'error.main' }} onClick={handleLeave}>
            <DeleteForeverRoundedIcon />
            Leave
          </MenuItem>
        )}
      </Popover>
    </>
  );
}

NewsItem.propTypes = {
  deleteItem: PropTypes.func,
  leaveProject: PropTypes.func,
  owner: PropTypes.bool,
  project: PropTypes.object,
};
