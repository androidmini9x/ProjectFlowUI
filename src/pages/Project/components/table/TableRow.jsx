import { useState } from 'react';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

import RouteWrap from '../../../../route/components/routeWrapper';

// ----------------------------------------------------------------------

export default function TableRowTask({
  id,
  name,
  description,
  start,
  end,
  status,
  handleDelete,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const deleteItem = () => {
    handleDelete(id);
    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell padding="checkbox" />

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{description}</TableCell>

        <TableCell>{start}</TableCell>

        <TableCell align="center">{end}</TableCell>

        <TableCell>
          <Chip label={status} />
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <MoreVertRoundedIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <EditNoteRoundedIcon sx={{ mr: 2 }} />
          <Link
            component={RouteWrap}
            href={`task/${id}/edit`}
            color="inherit"
            variant="subtitle2"
            underline="hover"
            noWrap
          >
            Edit
          </Link>
        </MenuItem>

        <MenuItem onClick={deleteItem} sx={{ color: 'error.main' }}>
          <DeleteForeverRoundedIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

TableRowTask.propTypes = {
  id: PropTypes.any,
  description: PropTypes.any,
  end: PropTypes.any,
  name: PropTypes.any,
  start: PropTypes.any,
  status: PropTypes.string,
  handleDelete: PropTypes.func,
};
