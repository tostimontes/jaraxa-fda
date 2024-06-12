import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medication, setMedication] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.fda.gov/drug/label.json?search=id:${id}`,
      );
      setMedication(response.data.results[0]);
    };

    fetchData();
  }, [id]);

  if (!medication) return <div>Loading...</div>;

  return (
    <Card className="m-4">
      <CardContent>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Typography variant="h4" component="div">
          {medication.openfda.brand_name?.[0]}
        </Typography>
        <Typography variant="body1" component="div">
          {medication.openfda.generic_name?.[0]}
        </Typography>
        {medication.indications_and_usage && (
          <Accordion defaultExpanded>
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
  );
};

export default DetailsPage;
