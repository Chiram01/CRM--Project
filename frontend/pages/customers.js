import { useEffect, useState } from "react";
import { getCustomers, addCustomer, editCustomer, deleteCustomer, updateCustomerRemark, updateCustomer } from "../utils/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState(""); // new state for alternate phone
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("Active"); // new state for status
  const [editId, setEditId] = useState(null);
  const [editingRemarks, setEditingRemarks] = useState({}); // to track remarks being edited
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // default sort order is none
  const [originalCustomers, setOriginalCustomers] = useState([]); // to store original order

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
      setOriginalCustomers(res.data); // to store original order
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please enter both name and phone number.");
      return;
    }
  
    try {
      if (editId) {
        await editCustomer(editId, { cname: name, cphone: phone, alternate_phone: altPhone, status });
        setEditId(null);
      } else {
        await addCustomer({ cname: name, cphone: phone, alternate_phone: altPhone, status });
      }
      fetchCustomers(); // to refresh list
      setName("");
      setPhone("");
      setAltPhone(""); // to reset alternate phone
      setStatus("Active"); // to reset status to default
    } catch (error) {
      console.error("Error adding/editing customer:", error);
    }
  };

  const handleEdit = (customer) => {
    setEditId(customer.cid);
    setName(customer.cname);
    setPhone(customer.cphone);
    setAltPhone(customer.alternate_phone || ""); // to load existing alt phone
    setRemark(customer.remark || ""); // to load existing remark
    setStatus(customer.status || "Active"); // to load existing status
  };

  const handleDelete = async (cid) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(cid);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleRemarkChange = (cid, newRemark) => {
    setEditingRemarks((prev) => ({ ...prev, [cid]: newRemark }));
  };

  const handleUpdateRemark = async (cid, remark) => {
    try {
      await updateCustomerRemark(cid, remark);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  const handleStatusChange = async (cid, newStatus) => {
    try {
      await updateCustomer(cid, { status: newStatus });
      fetchCustomers();
    } catch (error) {
      if (error.response) {
        // the server responded with a status other than 200 range
        console.error("Error updating status:", error.response.data);
      } else if (error.request) {
        // the request was made but no response was received
        console.error("Error updating status: No response received", error.request);
      } else {
        // Something else or nonsense as happened while setting up the request
        console.error("Error updating status:", error.message);
      }
    }
  };

  // to handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // to  handle Sort ri8 now not working
  const handleSortToggle = () => {
    const priority = { "Active": 1, "In Progress": 2, "Inactive": 3 };
    let sortedCustomers;

    if (sortOrder === "none") {
      sortedCustomers = [...customers].sort((a, b) => priority[a.status] - priority[b.status]);
      setSortOrder("Active");
    } else if (sortOrder === "Active") {
      sortedCustomers = [...customers].sort((a, b) => priority[b.status] - priority[a.status]);
      setSortOrder("Inactive");
    } else {
      sortedCustomers = [...originalCustomers]; // so as to reset to original order
      setSortOrder("none");
    }

    setCustomers(sortedCustomers);
  };

  // to filter customers (definitely not working)
  const filteredCustomers = customers.filter((customer) =>
    customer.cname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>𝒞𝓊𝓈𝓉𝑜𝓂𝑒𝓇</h2>

      {/* this to add/edit the customer form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alternate Phone (Optional)"
          value={altPhone}
          onChange={(e) => setAltPhone(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Active">Active</option>
          <option value="In Progress">In Progress</option>
          <option value="Inactive">Inactive</option>
        </select>
        
        {/* this is to basically ensure that only remark field is shown when adding a new customer */}
        {!editId && (
          <input
            type="text"
            placeholder="Remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        )}

        <button type="submit" style={{ fontSize: "1rem", padding: "8px 16px" }}>{editId ? "𝖴𝗉𝖽𝖺𝗍𝖾 𝖢𝗎𝗌𝗍𝗈𝗆𝖾𝗋" : " 𝖠𝖽𝖽 𝖢𝗎𝗌𝗍𝗈𝗆𝖾𝗋"}</button>
      </form>

      {/* its basically for seraching the customer and sorting the customer */}
      <input
        type="text"
        placeholder="Search customers"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={handleSortToggle} style={{ fontSize: "1rem", padding: "8px 16px" }}>
        {sortOrder === "none" ? "Sort by Active" : sortOrder === "Active" ? "Sort by Inactive" : "Reset Sort"}
      </button>

      {/* theee Customer List */}
      <div style={{ maxHeight: "200px", overflowY: "scroll" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", border: "2px solid #384959" }}>
          <thead>
            <tr>
              <th style={{ border: "2px solid #384959" }}>ID</th>
              <th style={{ border: "2px solid #384959" }}>Name</th>
              <th style={{ border: "2px solid #384959" }}>Phone</th>
              <th style={{ border: "2px solid #384959" }}>Alternate Phone</th>
              <th style={{ border: "2px solid #384959" }}>Remark</th>
              <th style={{ border: "2px solid #384959" }}>Status</th>
              <th style={{ border: "2px solid #384959" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.cid}>
                <td style={{ border: "2px solid #384959" }}>{c.cid}</td>
                <td style={{ border: "2px solid #384959" }}>{c.cname}</td>
                <td style={{ border: "2px solid #384959" }}>{c.cphone}</td>
                <td style={{ border: "2px solid #384959" }}>{c.alternate_phone || "N/A"}</td>
                <td style={{ border: "2px solid #384959" }}>
                  <input
                    type="text"
                    value={editingRemarks[c.cid] || c.remark || ""}
                    onChange={(e) => handleRemarkChange(c.cid, e.target.value)}
                    style={{ marginRight: "10px" }} // its a margin to separate from button
                  />
                  <button onClick={() => handleUpdateRemark(c.cid, editingRemarks[c.cid] || c.remark || "")} style={{ fontSize: "1rem", padding: "8px 16px" }}>
                  𝖴𝗉𝖽𝖺𝗍𝖾 𝖱𝖾𝗆𝖺𝗋𝗄
                  </button>
                </td>
                <td style={{ border: "2px solid #384959" }}>
                  <select value={c.status} onChange={(e) => handleStatusChange(c.cid, e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td style={{ border: "2px solid #384959" }}>
                  <button onClick={() => handleEdit(c)} style={{ marginRight: "10px", fontSize: "1rem", padding: "8px 16px" }}>𝖤𝖽𝗂𝗍</button>
                  <button onClick={() => handleDelete(c.cid)} style={{ fontSize: "1rem", padding: "8px 16px" }}>𝖣𝖾𝗅𝖾𝗍𝖾</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
