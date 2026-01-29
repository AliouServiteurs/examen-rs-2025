import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PhoneIcon from '@mui/icons-material/Phone';
import { personneAPI } from '../../services/api';

export default function PersonneDialog({ open, onClose, personne, onSuccess }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    telephone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (personne) {
      // Enlever +221 et espaces si présent pour l'édition
      const tel = personne.telephone ? personne.telephone.replace('+221', '').replaceAll(' ', '') : '';
      setForm({ ...personne, telephone: tel });
    } else {
      setForm({ nom: '', prenom: '', dateNaissance: '', adresse: '', telephone: '' });
    }
    setErrors({});
  }, [personne, open]);

  // Validation Nom/Prénom (lettres et espaces uniquement)
  const validateNomPrenom = (value, field) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!value.trim()) {
      return `Le ${field} est obligatoire`;
    }
    if (!regex.test(value)) {
      return `Le ${field} ne doit contenir que des lettres et des espaces`;
    }
    return null;
  };

  // Validation Téléphone (9 chiffres commençant par 7)
  const validateTelephone = (value) => {
    if (!value) return null; // Optionnel
    
    const cleaned = value.replaceAll(' ', '');
    const regex = /^7[0-8]\d{7}$/;
    
    if (cleaned.length !== 9) {
      return 'Le numéro doit contenir exactement 9 chiffres';
    }
    if (!regex.test(cleaned)) {
      return 'Le numéro doit commencer par 7 (ex: 77, 78, 76, 75, 70)';
    }
    return null;
  };

  // Validation Adresse (lettres, chiffres, espaces, tirets, virgules, points)
  const validateAdresse = (value) => {
    if (!value) return null; // Optionnel
    
    const regex = /^[a-zA-Z0-9À-ÿ\s,.-]+$/;
    if (!regex.test(value)) {
      return 'L\'adresse contient des caractères invalides';
    }
    return null;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    
    // Validation en temps réel
    let error = null;
    if (field === 'nom' || field === 'prenom') {
      error = validateNomPrenom(value, field);
    } else if (field === 'telephone') {
      error = validateTelephone(value);
    } else if (field === 'adresse') {
      error = validateAdresse(value);
    }
    
    setErrors({ ...errors, [field]: error });
  };

  const handleTelephoneChange = (e) => {
    // Accepter seulement les chiffres
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 9) {
      handleChange('telephone', value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation complète
    const newErrors = {};
    newErrors.nom = validateNomPrenom(form.nom, 'nom');
    newErrors.prenom = validateNomPrenom(form.prenom, 'prénom');
    newErrors.telephone = validateTelephone(form.telephone);
    newErrors.adresse = validateAdresse(form.adresse);
    
    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(newErrors).some(error => error !== null);
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      if (personne?.id) {
        await personneAPI.update(personne.id, form);
        onSuccess('Personne modifiée avec succès', 'success');
      } else {
        await personneAPI.create(form);
        onSuccess('Personne créée avec succès', 'success');
      }
      handleClose();
    } catch (error) {
      console.error('Erreur:', error);
      const message = error.response?.data?.message || 
                     JSON.stringify(error.response?.data?.errors) || 
                     error.message;
      onSuccess(`Erreur: ${message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ nom: '', prenom: '', dateNaissance: '', adresse: '', telephone: '' });
    setErrors({});
    onClose();
  };

  // Formater l'affichage du téléphone
  const displayTelephone = form.telephone 
    ? `+221 ${form.telephone.substring(0, 2)} ${form.telephone.substring(2, 5)} ${form.telephone.substring(5, 7)} ${form.telephone.substring(7, 9)}`
    : '';

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        elevation: 3,
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {personne ? 'Modifier la personne' : 'Nouvelle personne'}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                required
                value={form.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                error={!!errors.nom}
                helperText={errors.nom || 'Lettres uniquement'}
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                required
                value={form.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                error={!!errors.prenom}
                helperText={errors.prenom || 'Lettres uniquement'}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={form.dateNaissance || ''}
                onChange={(e) => handleChange('dateNaissance', e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={form.telephone}
                onChange={handleTelephoneChange}
                error={!!errors.telephone}
                helperText={errors.telephone || 'Format: 77 123 45 67 (9 chiffres)'}
                placeholder="771234567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                      +221
                    </InputAdornment>
                  ),
                }}
              />
              {form.telephone && !errors.telephone && (
                <FormHelperText sx={{ color: 'success.main' }}>
                  Affichage: {displayTelephone}
                </FormHelperText>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={2}
                value={form.adresse || ''}
                onChange={(e) => handleChange('adresse', e.target.value)}
                error={!!errors.adresse}
                helperText={errors.adresse || 'Ex: Dakar, Plateau ou Saint-Louis, Rue 15'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}