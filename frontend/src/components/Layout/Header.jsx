import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default function Header() {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <AccountTreeIcon sx={{ mr: 2, fontSize: 28 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Système de Gestion des Personnes
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Architecture REST & GraphQL
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ 
          bgcolor: 'rgba(255,255,255,0.1)', 
          px: 2, 
          py: 0.5, 
          borderRadius: 1 
        }}>
          v1.0.0
        </Typography>
      </Toolbar>
    </AppBar>
  );
}