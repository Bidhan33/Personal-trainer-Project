import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { saveTraining, fetchCustomers } from './api';

export default function AddTraining({ onTrainingAdded }) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTraining, setNewTraining] = useState({
    date: null,
    time: '',
    duration: '',
    activity: '',
    customer: '',
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCustomers();
        console.log('Customer response:', response); // Debug log
        
        // Handle different response structures
        let customersList = [];
        if (Array.isArray(response)) {
          customersList = response;
        } else if (response.content) {
          customersList = response.content;
        } else if (response._embedded && response._embedded.customers) {
          customersList = response._embedded.customers;
        }
        
        console.log('Processed customers:', customersList); // Debug log
        setCustomers(customersList);
      } catch (err) {
        console.error('Error loading customers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTraining({
      date: null,
      time: '',
      duration: '',
      activity: '',
      customer: '',
    });
  };

  const handleChange = (e) => {
    setNewTraining({ ...newTraining, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setNewTraining({ ...newTraining, date });
  };

  const handleSave = async () => {
    const { date, time, duration, activity, customer } = newTraining;
    
    if (!date || !time || !duration || !activity || !customer) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedCustomer = customers.find(
      c => `${c.firstname} ${c.lastname}` === customer
    );

    if (!selectedCustomer) {
      alert("Please select a valid customer");
      return;
    }

    try {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      const trainingToSubmit = {
        date: dateTime.toISOString(),
        duration: parseInt(duration),
        activity,
        customer: selectedCustomer.links?.self?.href || 
                 selectedCustomer._links?.self?.href || 
                 `${import.meta.env.VITE_API_URL}/customers/${selectedCustomer.id}`
      };

      await saveTraining(trainingToSubmit);
      onTrainingAdded();
      handleClose();
    } catch (error) {
      console.error("Error saving training:", error);
      alert("Failed to save training. Please try again.");
    }
  };

  const renderCustomerSelect = () => {

    return customers.map((customer) => (
      <MenuItem 
        key={customer.id || customer._links?.self?.href} 
        value={`${customer.firstname} ${customer.lastname}`}
      >
        {customer.firstname} {customer.lastname}
      </MenuItem>
    ));
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "blue",
          margin: "10px 0",
          "&:hover": {
            backgroundColor: "darkblue",
          },
        }}
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        Add Training
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Training</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Training Date"
              value={newTraining.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth required />} // we need to add some more details here to dO; later i have to recheck this (for saturday)
              sx={{ marginTop: 2 }}
            />
          </LocalizationProvider>

          <TextField
            margin="dense"
            name="time"
            label="Time"
            type="time"
            value={newTraining.time}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="duration"
            label="Duration (minutes)"
            type="number"
            value={newTraining.duration}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            margin="dense"
            name="activity"
            label="Activity"
            value={newTraining.activity}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControl fullWidth margin="dense" required>
            <InputLabel>Customer</InputLabel>
            <Select
              name="customer"
              value={newTraining.customer}
              onChange={handleChange}
              label="Customer"
            >
              {renderCustomerSelect()}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}