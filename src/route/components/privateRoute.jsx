import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import UserContext from '../../context/store';

function PrivateRoute({ children }) {
  const { authed } = useContext(UserContext);

  if (!authed?.auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.object,
};
