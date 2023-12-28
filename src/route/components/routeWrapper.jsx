import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const RouteWrap = forwardRef(({ href, ...other }, ref) => (
  <Link ref={ref} to={href} {...other} />
));

RouteWrap.propTypes = {
  href: PropTypes.string,
};

export default RouteWrap;
