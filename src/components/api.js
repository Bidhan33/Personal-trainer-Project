
export function fetchTrainingsWithCustomerInfo() {
  return fetch(`${import.meta.env.VITE_API_URL}/gettrainings`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch trainings with customer info: " + response.statusText);
      }
      return response.json();
    });
}


export function fetchCustomers() {
  return fetch(`${import.meta.env.VITE_API_URL}/customers`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch customers: " + response.statusText);
      }
      return response.json();
    });
}


export function fetchTrainingsForCustomer() {
  return fetch(`${import.meta.env.VITE_API_URL}/trainings`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to fetch trainings: " + response.statusText);
    }
    return response.json();
  });
}

export function deleteCustomer(url) {
  return fetch(url, { method: "DELETE" })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error in delete: " + response.statusText);
      }
      return response.json();
    });
}

export function saveCustomer(newCustomer) {
  return fetch(`${import.meta.env.VITE_API_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCustomer)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error in SAVING: " + response.statusText);
      }
      return response.json();
    });
}

export function updateCustomer(url, updatedCustomer) {
  return fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCustomer)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error in updating: " + response.statusText);
      }
      return response.json();
    });
}


export function saveTraining(newTraining) {
  return fetch(`${import.meta.env.VITE_API_URL}/trainings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTraining)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error in saving training: " + response.statusText);
    }
    return response.json();
  });
}

export function deleteTraining(url) {
  return fetch(url, { method: "DELETE" })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error in delete training: " + response.statusText);
    }
  });
}

export const addTraining = (training) => {
  return fetch('https://your-api-endpoint.com/api/trainings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(training)
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to add training');
    }
    return response.json();
  });
};