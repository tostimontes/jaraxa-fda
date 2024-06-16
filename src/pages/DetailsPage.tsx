import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Container,
  Box,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScrollToTopButton from '../components/ScrollToTopButton';

interface Medication {
  id: string;
  openfda: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    product_type?: string[];
  };
  description?: string;
  indications_and_usage?: string;
  warnings?: string;
  adverse_reactions?: string;
  drug_interactions?: string;
  pharmacodynamics?: string;
  pharmacokinetics?: string;
  spl_product_data_elements?: string;
  adverse_reaction_table?: string;
  dosage_and_administration?: string;
  contraindications?: string;
}
const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [medication, setMedication] = useState<Medication | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.fda.gov/drug/label.json?search=id:${id}`,
      );
      setMedication(response.data.results[0]);
    };

    fetchData();
  }, [id]);

  if (!medication)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Box display="flex" alignItems="center">
          <CircularProgress size={40} />
          <Box ml={2}>Loading...</Box>
        </Box>
      </Box>
    );

  return (
    <Container>
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 20, sm: 20, md: 0, lg: 0, xl: 0 },
          right: { xs: 16, sm: 16, md: 72, lg: 72, xl: 72 },
          mt: { xs: 6, sm: 6, md: 2, lg: 2, xl: 2 },
          zIndex: 1300,
        }}
      >
        <Button variant="contained" onClick={() => navigate(-1)} size="large">
          Back
        </Button>
      </Box>

      <Card
        sx={{
          mt: { xs: 16, sm: 16, md: 2, lg: 2, xl: 2 },
          width: '100%',
          maxWidth: { xs: '100%', sm: '100%', md: '75%' },
          mx: 'auto',
        }}
      >
        <CardContent
          sx={{
            textAlign: { xs: 'center', sm: 'center', md: 'left' },
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Typography variant="h4" component="div">
            {medication.openfda.brand_name?.[0]}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              letterSpacing: '2px',
              fontStyle: 'italic',
            }}
          >
            {medication.openfda.generic_name?.[0]}
          </Typography>
          <Typography variant="h6" component="div" color="secondary">
            by {medication.openfda.manufacturer_name?.[0]}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color:
                medication.openfda.product_type?.[0] === 'HUMAN OTC DRUG'
                  ? 'otc.main'
                  : medication.openfda.product_type?.[0] ===
                      'HUMAN PRESCRIPTION DRUG'
                    ? 'prescription.main'
                    : 'secondary',
            }}
          >
            <Box component="span" sx={{ color: 'text.primary' }}>
              Status:{' '}
            </Box>
            {medication.openfda.product_type?.[0] === 'HUMAN PRESCRIPTION DRUG'
              ? 'Prescription'
              : medication.openfda.product_type?.[0] === 'HUMAN OTC DRUG'
                ? 'OTC'
                : 'N/A'}
          </Typography>
          {medication.description && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.description}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.indications_and_usage && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Indications and Usage</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.indications_and_usage}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.warnings && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Warnings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{medication.warnings}</Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.adverse_reactions && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Adverse Reactions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.adverse_reactions}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.drug_interactions && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Drug Interactions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.drug_interactions}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.pharmacodynamics && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Pharmacodynamics</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.pharmacodynamics}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.pharmacokinetics && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Pharmacokinetics</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.pharmacokinetics}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.spl_product_data_elements && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">SPL Product Data Elements</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.spl_product_data_elements}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.adverse_reaction_table && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Adverse Reaction Table</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.adverse_reaction_table}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.dosage_and_administration && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Dosage and Administration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.dosage_and_administration}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {medication.contraindications && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Contraindications</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {medication.contraindications}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
      <ScrollToTopButton />
    </Container>
  );
};

export default DetailsPage;
