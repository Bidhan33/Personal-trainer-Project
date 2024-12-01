import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

export default function AddCustomer({ onAddCustomer }) {
  const [open, setOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    city: '',
    email: '',
    phone: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
   
    setNewCustomer({
      firstname: '',
      lastname: '',
      city: '',
      email: '',
      phone: '',
    });
  };

  const handleChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const { firstname, lastname, city, email, phone } = newCustomer;
    if (!firstname || !lastname || !city || !email || !phone) {
      alert("All fields are required.");
      return;
    }
    
    onAddCustomer(newCustomer);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "green",
          margin: "10px 0",
          "&:hover": {
            backgroundColor: "darkgreen",
          },
        }}
        startIcon={<AddIcon />}
        onClick={handleClickOpen}  
      >
        Add Customer
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        BackdropProps={{
          'aria-hidden': 'false',
        }}
      >
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstname"
            label="First Name"
            value={newCustomer.firstname}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            name="lastname"
            label="Last Name"
            value={newCustomer.lastname}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            value={newCustomer.city}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            value={newCustomer.email}
            onChange={handleChange}
            fullWidth
            required
            type="email"
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            value={newCustomer.phone}
            onChange={handleChange}
            fullWidth
            required
          />
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