import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';

import SvgColor from '../../../components/SvgColor';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'project',
    path: '/project',
    icon: <AccountTreeRoundedIcon />,
  },
  {
    title: 'invitation',
    path: '/invitation',
    icon: <Diversity3RoundedIcon />,
  },
  {
    title: 'profile',
    path: '/profile',
    icon: icon('ic_user'),
  },
];

export default navConfig;
