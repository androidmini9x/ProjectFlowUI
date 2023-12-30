import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { deepOrange } from '@mui/material/colors';
import Chip from '@mui/material/Chip';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

// ----------------------------------------------------------------------

export default function TableRowTeam({
  id,
  name,
  email,
  teamRole,
  avatar,
  removeMember,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRemove = () => {
    removeMember(id);
    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell padding="checkbox" />

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{avatar}</Avatar>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>
          <Chip label={teamRole} />
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
        <MenuItem onClick={handleRemove} sx={{ color: 'error.main' }}>
          <DeleteForeverRoundedIcon sx={{ mr: 2 }} />
          Remove
        </MenuItem>
      </Popover>
    </>
  );
}

TableRowTeam.propTypes = {
  id: PropTypes.any,
  email: PropTypes.any,
  name: PropTypes.any,
  teamRole: PropTypes.any,
  removeMember: PropTypes.func,
  avatar: PropTypes.string,
};
