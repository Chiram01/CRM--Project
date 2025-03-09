import axios from "axios";

const API_URL = "http://localhost:3000/customers";  // Base URL for customers
const REMINDER_URL = "http://localhost:3000/reminders";  // Base URL for reminders


//to add Customer
export const addCustomer = async (customerData) => {
  return await axios.post(`${API_URL}/add`, customerData);
};

// to get Customers
export const getCustomers = async () => {
  return await axios.get(API_URL);
};

// to update Customer
export const updateCustomer = async (cid, updatedData) => {
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

// to get Reminders (not working error)
export const getReminders = async () => {
  return await axios.get(REMINDER_URL);
};

// to delete Reminder
export const deleteReminder = async (rid) => {
  return await axios.delete(`${REMINDER_URL}/delete/${rid}`);
};

