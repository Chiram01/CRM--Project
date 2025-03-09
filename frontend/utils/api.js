import axios from "axios";
import moment from "moment";

const API_URL = "http://localhost:3000/customers";  // Base URL for customers


const REMINDER_URL = "http://localhost:3000/reminders";  // Base URL for reminders

// for adding Customer
export const addCustomer = async (customerData) => {
  return await axios.post(`${API_URL}/add`, customerData);
};

// for getting the Customers
export const getCustomers = async () => {
  return await axios.get(API_URL);
};

// to update Customer (Name & Phone only since i was getting error for remark when doing all three together)
export const updateCustomer = async (cid, updatedData) => {
  try {
    return await axios.put(`${API_URL}/update/${cid}`, updatedData);
  } catch (error) {
    if (error.response) {
      // if the server responded with a status other than 200 range
      console.error("Error updating customer:", error.response.data);
    } else if (error.request) {
      // request was made but no response received
      console.error(" Error updating customer: No response received", error.request);
    } else {
      // Something else or anything other than wt was required has happened while setting up the request
      console.error("Error updating customer:", error.message);
    }
    throw error;
  }
};

// to update Customer Remark Separately
export const updateCustomerRemark = async (cid, remark) => {
  return await axios.put(`${API_URL}/update-remark/${cid}`, { remark });
};

// to edit Customer (Same as the updateCustomer)
export const editCustomer = async (cid, updatedData) => {
  return await axios.put(`${API_URL}/update/${cid}`, updatedData);
};

// to delete Customer
export const deleteCustomer = async (cid) => {
  return await axios.delete(`${API_URL}/delete/${cid}`);
};

// to add Reminder
export const addReminder = async (reminderData) => {
  return await axios.post(`${REMINDER_URL}/add`, reminderData);
};

// to get Reminders
export const getReminders = async () => {
  try {
    const response = await axios.get(REMINDER_URL);
    //  to convert reminder_date to local timezone cause it was in foreign timezone
    const remindersWithLocalTime = response.data.map(reminder => ({
      ...reminder,
      reminder_date: moment(reminder.reminder_date).format('YYYY-MM-DD'),
    }));
    return { data: remindersWithLocalTime };
  } catch (error) {
    console.error(" Error fetching reminders:", error);
    throw error;
  }
};


// to delete Reminder with Error Handling
export const deleteReminder = async (rid) => {
  try {
    const response = await axios.delete(`${REMINDER_URL}/delete/${rid}`);
    console.log("✅ Reminder deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting reminder:", error.response?.data || error.message);
    alert("Failed to delete reminder: " + (error.response?.data?.error || error.message));
    throw error;
  }
};


const fetchReminders = async () => {
  const reminders = await getReminders();
  console.log(reminders); // this will show the reminder IDs in the console which apparently is not working
};
