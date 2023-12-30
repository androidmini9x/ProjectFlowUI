import { Helmet } from 'react-helmet-async';

import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

import UserContext from '../../context/store';
import { usePathname } from '../../hooks/use-pathname';
import TableHead from './components/table/TableHead';
import TableRowTask from './components/table/TableRow';
import TableNoData from './components/table/TableNoData';
import TableToolbar from './components/table/TableToolbar';
import TableRowTeam from './components/table/TableRowTeam';
import TableEmptyRows from './components/table/TableEmptyRows';
import { emptyRows } from './components/table/utils';

import CalenderUI from './components/CalenderUI';
import RouteWrap from '../../route/components/routeWrapper';

function ProjectDetail() {
  const { authed } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [pageTeam, setPageTeam] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPageTeam, setRowsPerPageTeam] = useState(5);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(null);
  const [task, setTask] = useState([]);
  const [team, setTeam] = useState([]);

  const { id } = useParams();

  const pathname = usePathname();

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const api = `${import.meta.env.VITE_API}/project/${id}`;
        const req = await fetch(`${api}/task`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': authed.token,
          },
        });
        const data = await req.json();
        if (req.status === 200) {
          setTask(data);
        }
        const req2 = await fetch(`${api}/teams`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Token': authed.token,
          },
        });
        const data2 = await req2.json();
        if (req.status === 200) {
          setTeam(data2);
        }
      } catch (err) {
        console.log('Error:', err);
      }
    };
    fetchDate();
  }, [authed.token, id]);

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    setFiltered(
      task.filter(
        (e) =>
          e.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1,
      ),
    );
  };

  const handleChangePage = (event, newPage, type) => {
    if (type === 'team') {
      setPageTeam(newPage);
    } else {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event, type) => {
    if (type === 'team') {
      setPageTeam(0);
      setRowsPerPageTeam(parseInt(event.target.value, 10));
    } else {
      setPage(0);
      setRowsPerPage(parseInt(event.target.value, 10));
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(null);
    setSuccess('');
    setError('');
  };

  const deleteTask = async (taskId) => {
    const api = `${import.meta.env.VITE_API}/project/${id}/task/${taskId}`;

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
        setOpen('error');
        setError(data.error);
      } else if (req.status === 200) {
        setTask(task.filter((e) => e._id !== taskId));
        setSuccess(data.message);
        setOpen('success');
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    }
  };

  const removeMember = async (memberId) => {
    const api = `${import.meta.env.VITE_API}/project/${id}/teams`;

    try {
      const req = await fetch(api, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': authed.token,
        },
        body: JSON.stringify({ removed_id: memberId }),
      });
      const data = await req.json();
      if (req.status !== 200) {
        setOpen('error');
        setError(data.error);
      } else if (req.status === 200) {
        setTeam(team.filter((e) => e._id !== memberId));
        setSuccess(data.message);
        setOpen('success');
      }
    } catch (err) {
      setError('Failed to connect to the Server');
    }
  };

  return (
    <>
      <Helmet>
        <title>Projects</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Info Project</Typography>
        </Stack>

        <Grid xs={12} md={6} lg={8} sx={{ py: 2, backgroundColor: 'white' }}>
          <Card>
            <CardHeader title="Calender" sx={{ mb: 2 }} />
            <Divider sx={{ borderStyle: 'dashed' }} />
          </Card>
          <Box sx={{ my: 4, px: 6 }}>
            <CalenderUI tasks={task} />
          </Box>
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={{ py: 2, mt: 4 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4">Tasks</Typography>

            <Button
              component={RouteWrap}
              href={`${pathname}/task/create`}
              variant="contained"
              color="inherit"
              startIcon={<AddRoundedIcon />}
            >
              Add Task
            </Button>
          </Stack>
          <Card>
            <CardHeader title="Tasks" sx={{ mb: 2 }} />
            <Divider sx={{ borderStyle: 'dashed' }} />
            <TableToolbar
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead
                  rowCount={task.length}
                  headLabel={[
                    { id: 'title', label: 'Title' },
                    { id: 'description', label: 'Description' },
                    { id: 'start', label: 'Start' },
                    { id: 'end', label: 'End' },
                    { id: 'status', label: 'Status' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {(filterName ? filtered : task)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRowTask
                        key={row._id}
                        id={row._id}
                        name={row.name}
                        description={row.description}
                        start={row.start}
                        end={row.end}
                        status="active"
                        handleDelete={deleteTask}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, task.length)}
                  />

                  {filtered.length === 0 && filterName && (
                    <TableNoData query={filterName} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              page={page}
              component="div"
              count={task.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={8} sx={{ py: 2, mt: 4 }}>
          <Card>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 3 }}
            >
              <CardHeader title="Teams" sx={{ mb: 2 }} />
              <Button
                component={RouteWrap}
                href={`${pathname}/invite`}
                variant="contained"
                color="inherit"
                startIcon={<PersonAddRoundedIcon />}
              >
                Add Member
              </Button>
            </Stack>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead
                  rowCount={team.length}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'role', label: 'Role' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {team.slice(pageTeam * 5, pageTeam * 5 + 5).map((row) => (
                    <TableRowTeam
                      key={row._id}
                      id={row._id}
                      name={`${row.firstname} ${row.lastname}`}
                      avatar={`${row.firstname.charAt(0)}${row.lastname.charAt(
                        0,
                      )}`}
                      email={row.email}
                      teamRole="Developer"
                      removeMember={removeMember}
                    />
                  ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(
                      pageTeam,
                      rowsPerPageTeam,
                      team.length,
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              page={pageTeam}
              component="div"
              count={team.length}
              rowsPerPage={rowsPerPageTeam}
              onPageChange={(event, newPage) =>
                handleChangePage(event, newPage, 'team')
              }
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={(event) =>
                handleChangeRowsPerPage(event, 'team')
              }
            />
          </Card>
        </Grid>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={open === 'error' ? 'error' : 'success'}
            sx={{ width: '100%', fontWeight: 'bold' }}
          >
            {open === 'error' ? error : success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default ProjectDetail;
