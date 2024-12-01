import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { updateCustomer } from './api';

export default function EditCustomer(props) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({
    firstname: '',
    lastname: '',
    city: '',
    email: '',
    phone: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
    setCustomer({ ...props.data });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setCustomer({ ...customer, [event.target.name]: event.target.value });
  };

  const handleSave = () => {
    updateCustomer(props.data._links.self.href, customer)
      .then(() => {
        props.handleFetch();
        handleClose();
      })
      .catch(err => console.error('Error updating customer:', err));
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<EditIcon />}
      ></Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstname"
            label="First Name"
            value={customer.firstname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="lastname"
            label="Last Name"
            value={customer.lastname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            value={customer.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            value={customer.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            value={customer.phone}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
