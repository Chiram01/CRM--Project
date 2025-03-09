require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); //this is to enable CORS for frontend connection

const app = express();
const PORT = 3000;


// this is middleware
app.use(express.json()); // JSON requests
app.use(cors()); // it allows cross-origin requests

// this is for MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connectinggg to MySQL
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("✅ Connected to MySQL Database!");
});

// tdefault route
app.get("/", (req, res) => {
    res.send("Hello, CRM Backend is connected to MySQL!");
});

// get +> all customers
app.get("/customers", (req, res) => {
    db.query("SELECT cid, cname, cphone, alternate_phone, remark FROM customers", (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// add => new customer
app.post("/customers/add", (req, res) => {
    const { cname, cphone, alternate_phone } = req.body;
    if (!cname || !cphone) {
        return res.status(400).json({ error: "Customer name and phone are required" });
    }

    const sql = "INSERT INTO customers (cname, cphone, alternate_phone) VALUES (?, ?, ?)";
    db.query(sql, [cname, cphone, alternate_phone || null], (err, result) => {
        if (err) {
            console.error("Error inserting customer:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Customer added successfully!", customerId: result.insertId });
    });
});

// update a customer
// this is route to update name & phone
app.put("/customers/update/:cid", (req, res) => {
    const { cid } = req.params;
    const { cname, cphone, alternate_phone } = req.body;

    const sql = "UPDATE customers SET cname = ?, cphone = ?, alternate_phone = ? WHERE cid = ?";
    db.query(sql, [cname, cphone, alternate_phone, cid], (err, result) => {
        if (err) {
            console.error("Error updating customer:", err);
            res.status(500).json({ error: "Failed to update customer" });
        } else {
            res.json({ message: "Customer updated successfully" });
        }
    });
});

// this is route to update only the remark
app.put("/customers/update-remark/:cid", (req, res) => {
    const { cid } = req.params;
    const { remark } = req.body;

    const sql = "UPDATE customers SET remark = ? WHERE cid = ?";
    db.query(sql, [remark, cid], (err, result) => {
        if (err) {
            console.error("Error updating remark:", err);
            res.status(500).json({ error: "Failed to update remark" });
        } else {
            res.json({ message: "Remark updated successfully" });
        }
    });
});

// delete a customer
app.delete("/customers/delete/:cid", (req, res) => {
    const { cid } = req.params;
  
    const sql = "DELETE FROM customers WHERE cid = ?";
    db.query(sql, [cid], (err, result) => {
      if (err) {
        console.error("Error deleting customer:", err);
        res.status(500).json({ error: "Failed to delete customer" });
      } else {
        res.json({ message: "Customer deleted successfully" });
      }
    });
});

// to add a follow-up for a customer
app.post("/followups/add", (req, res) => {
    const { customer_id, followup_date, notes } = req.body;
    if (!customer_id || !followup_date || !notes) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO follow_ups (customer_id, followup_date, notes) VALUES (?, ?, ?)";
    db.query(sql, [customer_id, followup_date, notes], (err, result) => {
        if (err) {
            console.error("Error adding follow-up:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Follow-up added successfully!", followupId: result.insertId });
    });
});

// Get  => follow-ups for a customer
app.get("/followups/:customer_id", (req, res) => {
    const { customer_id } = req.params;
    const sql = "SELECT * FROM follow_ups WHERE customer_id = ?";
    db.query(sql, [customer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

//  + Add Reminder
app.post("/reminders/add", (req, res) => {
    const { reminder_date, cid, message, reminder_time } = req.body;
    if (!reminder_date || !cid || !message || !reminder_time) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    const sql = "INSERT INTO reminders (reminder_date, cid, message, reminder_time) VALUES (?, ?, ?, ?)";
    db.query(sql, [reminder_date, cid, message, reminder_time], (err, result) => {
      if (err) {
        console.error(" Error adding reminder:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ success: true, rid: result.insertId });
    });
});

//  getttt Reminders
app.get("/reminders", (req, res) => {
    const sql = "SELECT reminders.*, customers.cname, customers.remark FROM reminders JOIN customers ON reminders.cid = customers.cid";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(" Error fetching reminders:", err);
            res.status(500).json({ error: "Failed to fetch reminders" });
        } else {
            console.log(" Retrieved Reminders:", results);
            res.json(results);
        }
    });
});

//  deleteee Reminder
app.delete("/reminders/delete/:rid", (req, res) => {
    const { rid } = req.params;

    // to check if the reminder exists before attempting to delete
    const checkSql = "SELECT * FROM reminders WHERE rid = ?";
    db.query(checkSql, [rid], (err, results) => {
        if (err) {
            console.error(" Error checking reminder:", err);
            return res.status(500).json({ error: "Database error while checking reminder" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Reminder not found" });
        }

        // Now  to delete the reminder
        const deleteSql = "DELETE FROM reminders WHERE rid = ?";
        db.query(deleteSql, [rid], (err, result) => {
            if (err) {
                console.error(" Error deleting reminder:", err);
                return res.status(500).json({ error: "Failed to delete reminder" });
            }

            res.json({ message: "Reminder deleted successfully" });
        });
    });
});



// to start the server
app.listen(PORT, () => {
    console.log(" Available Routes: /, /customers, /reminders, /reminders/add, /reminders/delete/:rid, /projects, /projects/add, /projects/update/:pid, /projects/delete/:pid, /projects/complete/:pid");

});