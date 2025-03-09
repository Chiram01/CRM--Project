import { useState, useEffect } from "react";
import { getReminders } from "../utils/api";
import moment from "moment-timezone"; // ✅ Import moment-timezone

const ReminderHandler = ({ onShowNotification }) => {
  const [reminders, setReminders] = useState([]);
  const [reminderSound, setReminderSound] = useState(null); // Use state to store the Audio object

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this code runs only on the client side
      setReminderSound(new Audio("/path/to/sound.mp3")); // Add the path to your sound file
    }
  }, []);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await getReminders();
        if (response && response.data) {
          setReminders(response.data);
          console.log("✅ Reminders Fetched:", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching reminders:", error);
      }
    };

    fetchReminders();
    const interval = setInterval(fetchReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // Get "HH:MM"
      
      reminders.forEach((r) => {
        if (r.reminder_time === currentTime) {
          console.log("🔔 Reminder is due:", r); // ✅ Debugging log
          showNotification(r);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [reminders]);

  const showNotification = (reminder) => {
    console.log("🔔 Showing notification for reminder:", reminder); // ✅ Debugging log
    if (reminderSound) reminderSound.play(); // Play the reminder sound if available

    // Show the custom notification popup
    onShowNotification(`${reminder.cname}: ${reminder.message}`);
  };

  return null;
};

export default ReminderHandler;
