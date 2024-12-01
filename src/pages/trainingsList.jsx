import { useState, useEffect } from "react";
import { fetchTrainingsWithCustomerInfo, deleteTraining } from "../components/api";
import { AgGridReact } from "ag-grid-react";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GymIcon from '@mui/icons-material/FitnessCenter';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AddTraining from "../components/addTraining";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";


function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(null);

  const colDefs = [
    { field: "activity", headerName: "Activity", filter: true },
    {
      field: "date",
      headerName: "Date",
      filter: true,
      valueFormatter: ({ value }) => new Date(value).toLocaleString(),
    },
    { field: "duration", headerName: "Duration (minutes)", filter: true },
    {
      field: "customerName",
      headerName: "Customer Name",
      valueGetter: (params) => {
        const customer = params.data.customer;
        return customer ? `${customer.firstname} ${customer.lastname}` : "Unknown Customer";
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        return (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              
              const url = params.data.links?.self?.href || 
                         `${import.meta.env.VITE_API_URL}/trainings/${params.data.id}`;
              setDeleteUrl(url);
              setConfirmDelete(true);
              console.log("Set delete URL:", url);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const fetchData = async () => {
    try {
      const trainingResponse = await fetchTrainingsWithCustomerInfo();
      const trainingList = trainingResponse || [];
      setTrainings(trainingList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteUrl) {
      console.error("No URL provided for deletion.");
      return;
    }

    console.log("Deleting training with URL:", deleteUrl);

    try {
      await deleteTraining(deleteUrl);
      console.log("Training deleted successfully");
      await fetchData(); 
      setConfirmDelete(false);
    } catch (error) {
      console.error("Error during deletion:", error);
      
    }
  };

  return (

    <div style={{ padding: '20px', height: '100%' }}>
 
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
    <FitnessCenterIcon color="primary" style={{ fontSize: '50px' }} />
    <Typography variant="h5" component="h1">Training List of Customers</Typography>
    
  </div>

    <div className="ag-theme-material" style={{ height: 800, width: "90%" }}>
      <AddTraining onTrainingAdded={fetchData} />

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this training?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <AgGridReact 
        rowData={trainings} 
        columnDefs={colDefs} 
        pagination={true}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
      />
    </div>
    </div>
  );
}

export default TrainingList;