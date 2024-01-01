import PropTypes from 'prop-types';

import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

// ----------------------------------------------------------------------

export default function TableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onHiddenFin,
}) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder="Search tasks..."
        startAdornment={
          <InputAdornment position="start">
            <ManageSearchIcon
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            color="warning"
            onChange={() => {
              onHiddenFin((prev) => !prev);
            }}
          />
        }
        label="Hidden Finished"
        labelPlacement="start"
      />
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onHiddenFin: PropTypes.func,
};
