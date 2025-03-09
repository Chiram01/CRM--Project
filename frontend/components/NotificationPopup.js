import React, { useEffect } from "react";

const NotificationPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Close the notification after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification-popup">
      <img src="/bell-icon.png" alt="Bell Icon" className="notification-icon" />
      <div className="notification-message">{message}</div>
    </div>
  );
};

export default NotificationPopup;
