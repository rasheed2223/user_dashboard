import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", department: "" });
  const [error, setError] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, formData);
      setUsers([...users, response.data]);
      setFormData({ id: "", name: "", email: "", department: "" });
    } catch (err) {
      setError("Failed to add user.");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/${selectedUser.id}`, formData);
      setUsers(users.map((user) => (user.id === selectedUser.id ? response.data : user)));
      setSelectedUser(null);
      setFormData({ id: "", name: "", email: "", department: "" });
    } catch (err) {
      setError("Failed to edit user.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, department: user.department || "" });
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{selectedUser ? "Edit User" : "Add User"}</h2>
      <form onSubmit={selectedUser ? handleEditUser : handleAddUser}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          placeholder="Department"
        />
        <button type="submit">{selectedUser ? "Update User" : "Add User"}</button>
      </form>
    </div>
  );
}

export default App;
