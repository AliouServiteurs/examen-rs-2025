import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function DeleteDialog({ open, onClose, onConfirm, personne }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="warning" />
        Confirmer la suppression
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer la personne{' '}
          <strong>{personne?.nom} {personne?.prenom}</strong> ?
          <br />
          Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}