import { useState, useEffect } from "react";
import axios from "axios";
import { getReminders, addReminder, deleteReminder, getCustomers } from "../utils/api";
import moment from "moment-timezone"; // import moment-timezone (initially was following the foriegn time zone)

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newReminder, setNewReminder] = useState({
    message: "",
    reminder_date: "",
    reminder_time: "",
    cid: "",
  });

  // to fetch the Reminders
  const fetchReminders = async () => {
    try {
      const response = await getReminders();
      if (response && response.data) {
        console.log("Fetched Reminders:", response.data); // for debugging
        setReminders(response.data);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // to fetch Customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // to add the Reminder
  const handleAddReminder = async () => {
    if (!newReminder.message || !newReminder.reminder_date || !newReminder.reminder_time || !newReminder.cid) {
      alert(" Please fill all fields including customer selection.");
      return;
    }

    try {
      await addReminder(newReminder);
      setNewReminder({ message: "", reminder_date: "", reminder_time: "", cid: "" });
      fetchReminders();
    } catch (error) {
      console.error(" Error adding reminder:", error.response ? error.response.data : error);
    }
  };

  // to delete Reminder
  const handleDeleteReminder = async (rid) => {
    if (!rid) {
      console.error(" Reminder ID is undefined! Cannot delete.");
      return;
    }

    console.log("Deleting reminder with ID:", rid); // debugging

    try {
      await deleteReminder(rid);
      console.log("Reminder deleted successfully");
      fetchReminders(); // to reload reminders instead of filtering manually cause its a lot of work
    } catch (error) {
      console.error("❌ Error deleting reminder:", error);
    }
  };

  return (
    <div>
      <h2>𝑅𝑒𝓂𝒾𝓃𝒹𝑒𝓇</h2>

      <input
        type="text"
        placeholder="Reminder message"
        value={newReminder.message}
        onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
      />
      <input
        type="date"
        value={newReminder.reminder_date}
        onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })}
      />
      <input
        type="time"
        value={newReminder.reminder_time}
        onChange={(e) => setNewReminder({ ...newReminder, reminder_time: e.target.value })}
      />

      {/* ✅ Customer Dropdown */}
      <select value={newReminder.cid} onChange={(e) => setNewReminder({ ...newReminder, cid: e.target.value })}>
        <option value="">Select a customer</option>
        {customers.map((c) => (
          <option key={c.cid} value={c.cid}>
            {c.cname}
          </option>
        ))}
      </select>

      <button onClick={handleAddReminder} style={{ fontSize: "1rem", padding: "8px 16px" }}>𝖠𝖽𝖽 𝖱𝖾𝗆𝗂𝗇𝖽𝖾𝗋</button>

      <h3>Reminders List</h3>
      <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", border: "2px solid #000000" }}>
          <thead>
            <tr>
              <th style={{ border: "2px solid #000000" }}>Message</th>
              <th style={{ border: "2px solid #000000" }}>Date</th>
              <th style={{ border: "2px solid #000000" }}>Time</th>
              <th style={{ border: "2px solid #000000" }}>Customer</th>
              <th style={{ border: "2px solid #000000" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r) => (
              <tr key={r.rid}>
                <td style={{ border: "2px solid #000000" }}>{r.message}</td>
                <td style={{ border: "2px solid #000000" }}>{r.reminder_date}</td>
                <td style={{ border: "2px solid #000000" }}>{r.reminder_time}</td>
                <td style={{ border: "2px solid #000000" }}>{r.cname || "Unknown"}</td>
                <td style={{ border: "2px solid #000000" }}>
                  <button onClick={() => handleDeleteReminder(r.rid)} style={{ fontSize: "1rem", padding: "8px 16px" }}>𝖣𝖾𝗅𝖾𝗍𝖾</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reminder;
