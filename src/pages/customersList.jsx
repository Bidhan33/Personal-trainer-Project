import { useState, useEffect } from 'react';
import { fetchCustomers, deleteCustomer, saveCustomer } from '../components/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddCustomer from '../components/addcustomer';
import EditCustomer from '../components/editcustomers';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; 
import DownloadIcon from '@mui/icons-material/Download';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';


export default function CustomerList({ searchQuery }) 
{
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const colDefs = [
    { field: 'firstname', headerName: 'First Name', filter: true },
    { field: 'lastname', headerName: 'Last Name', filter: true },
    { field: 'city', headerName: 'City', filter: true },
    
    { field: 'email', headerName: 'Email', filter: true },
    { field: 'phone', headerName: 'Phone', filter: true },
    {
      headerName: 'Actions',
      
      
      cellRenderer: (params) => (
        <>
          <EditCustomer data={params.data} handleFetch={handleFetch} />
          <IconButton
            onClick={() => handleDelete(params.data)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleFetch = () => {
    fetchCustomers()
      .then(data => {
        setCustomers(data._embedded.customers);
        filterCustomers(data._embedded.customers); 
      })
      .catch(err => console.error(err));
  };

  const filterCustomers = (customers) => {
    if (searchQuery.trim() === "") 
      {
      setFilteredCustomers(customers); 

    } else {
      const filtered = customers.filter((customer) =>
        customer.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Delete ${customer.firstname} ${customer.lastname}?`)) {
      deleteCustomer(customer._links.self.href).then(handleFetch);
    }
  };

  const handleAddCustomer = (newCustomer) => {
    saveCustomer(newCustomer)
      .then(() => handleFetch()) 
      .catch(err => console.error("Error saving customer:", err));
  };

  const exportToCSV = () => {
    const csvData = filteredCustomers.map(({ firstname, lastname, city, email, phone }) => ({
      firstname,
      lastname,
      city,
      email,
      phone,
    }));

    const csvContent = [
      ["First Name", "Last Name", "City", "Email", "Phone"], 
      ...csvData.map((row) => [row.firstname, row.lastname, row.city, row.email, row.phone]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    handleFetch(); 
  }, []);

  useEffect(() => {
    filterCustomers(customers); 
  }, [searchQuery, customers]);

  return (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: "15px", gap: '12px' }}>
        <PersonIcon  color="primary" style={{ fontSize: '50px', marginRight: '8px'  }} />
        <Typography variant="h5" gutterBottom>
          Customers List
        </Typography>
      </div>


      <Grid container alignItems="center" spacing={2} style={{ marginBottom: "10px" }}>
      
        <Grid item>
          <AddCustomer onAddCustomer={handleAddCustomer} />
        </Grid>

        
        <Grid item>
          <Button
            variant="contained"
            color="primary"
          
            onClick={exportToCSV}
            startIcon={<DownloadIcon/>}
          >

            Export to CSV
          </Button>
        </Grid>
      </Grid>



      <div className="ag-theme-material" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={filteredCustomers}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
