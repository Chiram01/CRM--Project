# CRM--Project

```
CRM_PROJECT/
│── backend/
│   ├── api.js                 # this handles backend API calls
│   ├── database.js             
│      
│   └── server.js              
│
│── frontend/
│   ├── components/
|   |   ├── ReminderHandler.js   
│   │    ├── Reminder.js        
│   │       
│   ├── pages/
|   |   ├── _app.js
|   |   ├──  customers.js
│   │   ├── index.js           # Main dashboard page
│   │   ├── reminders.js       
│   ├── styles/
│   │   ├── global.css         # Global styles for frontend
│   ├── utils/
│   │   ├── api.js
        ├──app.js       


### File Descriptions:

### **Backend**
#### `backend/index.js`  
- The main entry point for the backend server basically contains everything both customer and reminder.  


### **Frontend Components**
#### `frontend/components/ReminderHandler.js`  
- Handles fetching reminders and checking for due ones in the frontend.  
- Likely works with notifications to inform users when a reminder is due and logs.  

---

### **Frontend Pages**
#### `frontend/pages/_app.js`  
- The global wrapper for the Next.js app.  
- Manages layout, global styles, and state across all pages.  

#### `frontend/pages/customer.js`  
- Displays customer details and interactions.  
- Likely allows adding, updating, and tracking customer interactions.  

#### `frontend/pages/index.js`  
- The main dashboard of the CRM system.  
- Displays an overview of customers, reminders, and notifications(which isnt working).  

#### `frontend/pages/reminder.js`  
- The dedicated page for managing reminders.  
- Allows adding new reminders, listing existing ones, and deleting them.  

#### `frontend/utils/api.js`  
- Handles API calls to the backend.  
- Likely contains functions for fetching reminders, adding customers, etc.  

#### `frontend/utils/app.js`  
- General utility functions for the frontend.  
- Might include helper functions for formatting dates, notifications, etc.  

Also under component there is notificationpopup.js which is for notification which is not working at the moment 
also the customerid in customer page
