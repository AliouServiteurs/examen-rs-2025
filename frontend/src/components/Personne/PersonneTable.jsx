import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { apolloClient, QUERIES, personneAPI } from "../../services/api";
import DeleteDialog from "./DeleteDialog";

export default function PersonneTable({ onEdit, refresh }) {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({ nom: "", prenom: "", telephone: "" });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    personne: null,
  });

  useEffect(() => {
    loadPersonnes();
  }, [refresh]);

  const loadPersonnes = async () => {
    setLoading(true);
    try {
      const { data } = await apolloClient.query({
        query: QUERIES.ALL_PERSONNES,
        fetchPolicy: "network-only",
      });
      setPersonnes(data.allPersonnes);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await apolloClient.query({
        query: QUERIES.SEARCH_PERSONNES,
        variables: search,
        fetchPolicy: "network-only",
      });
      setPersonnes(data.searchPersonnes);
    } catch (error) {
      console.error("Erreur recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await personneAPI.delete(deleteDialog.personne.id);
      setDeleteDialog({ open: false, personne: null });
      loadPersonnes();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recherche avancée
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Nom"
              size="small"
              value={search.nom}
              onChange={(e) => setSearch({ ...search, nom: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Prénom"
              size="small"
              value={search.prenom}
              onChange={(e) => setSearch({ ...search, prenom: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Téléphone"
              size="small"
              value={search.telephone}
              onChange={(e) =>
                setSearch({ ...search, telephone: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              Rechercher
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadPersonnes}
            disabled={loading}
            size="small"
          >
            Réinitialiser
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2}>
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Liste des personnes</Typography>
          <Chip label={`${personnes.length} résultat(s)`} color="primary" />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nom</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Prénom</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date de naissance</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Adresse</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Téléphone</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personnes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      Aucune personne trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  personnes.map((personne) => (
                    <TableRow
                      key={personne.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{personne.id}</TableCell>
                      <TableCell>{personne.nom}</TableCell>
                      <TableCell>{personne.prenom}</TableCell>
                      <TableCell>{personne.dateNaissance || "-"}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {personne.adresse || "-"}
                      </TableCell>
                      <TableCell>
                        {personne.telephone
                          ? `+221 ${personne.telephone}`
                          : "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Modifier">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => onEdit(personne)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() =>
                              setDeleteDialog({ open: true, personne })
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, personne: null })}
        onConfirm={handleDelete}
        personne={deleteDialog.personne}
      />
    </>
  );
}
