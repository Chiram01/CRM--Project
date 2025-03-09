import Link from "next/link";
import { useState } from "react";
import ReminderHandler from "../components/ReminderHandler";
import NotificationPopup from "../components/NotificationPopup";

const HomePage = () => {
  const [notification, setNotification] = useState(null);

  const handleShowNotification = (message) => {
    setNotification(message);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div>
      <ReminderHandler onShowNotification={handleShowNotification} />
      {notification && (
        <NotificationPopup message={notification} onClose={handleCloseNotification} />
      )}
      <h2>𝒲𝑒𝓁𝒸𝑜𝓂𝑒 𝓉𝑜 𝓉𝒽𝑒 𝒞𝑅𝑀 𝒮𝓎𝓈𝓉𝑒𝓂!</h2>
      <p>𝙒𝙝𝙚𝙧𝙚 𝙬𝙤𝙪𝙡𝙙 𝙪 𝙡𝙞𝙠𝙚 𝙩𝙤 𝙜𝙤 ?</p>
      
      {/* the navigation to Customers Page */}
      <Link href="/customers">
        <button style={{ marginRight: "10px" }}>𝖵𝗂𝖾𝗐 𝖢𝗎𝗌𝗍𝗈𝗆𝖾𝗋𝗌</button>
      </Link>

      {/* the navigation to Reminders Page */}
      <Link href="/reminders">
        <button style={{ marginRight: "10px" }}>𝖵𝗂𝖾𝗐 𝖱𝖾𝗆𝗂𝗇𝖽𝖾𝗋𝗌</button>
      </Link>
    </div>
  );
};

export default HomePage;
