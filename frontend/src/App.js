import { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { theme } from './theme/theme';
import Header from './components/Layout/Header';
import PersonneTable from './components/Personne/PersonneTable';
import PersonneDialog from './components/Personne/PersonneDialog';
import Notification from './components/Common/Notification';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPersonne, setEditingPersonne] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleEdit = (personne) => {
    setEditingPersonne(personne);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPersonne(null);
  };

  const handleSuccess = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
    setRefresh(refresh + 1);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <PersonneTable onEdit={handleEdit} refresh={refresh} />
        </Container>

        <Tooltip title="Nouvelle personne" placement="left">
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            onClick={() => setDialogOpen(true)}
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        <PersonneDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          personne={editingPersonne}
          onSuccess={handleSuccess}
        />

        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={handleCloseNotification}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;