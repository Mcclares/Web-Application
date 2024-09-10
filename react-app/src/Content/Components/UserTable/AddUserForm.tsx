import React, { useState } from 'react';
import axios from 'axios';
import './UserTable.css';
import { getCookie } from '../../../Utils/cookie';
import Alert from 'react-bootstrap/Alert';
import config from "../../../config";

interface AddUserFormProps {
  onSubmit: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ Email: "", Username: "", FullName: "", Password: "", ConfirmPassword: "", Role: "ADMINISTRATOR" });
  const [error, setError] = useState<string | null>(null);
  const accessToken = getCookie("jwt");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
  const minLength = 8;
  const requireUppercase = /[A-Z]/;

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  if (!requireUppercase.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  return null;
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.Password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${config.apiBaseUrl}/authenticate/register`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setFormData({ Email: "", Username: "", FullName: "", Password: "", ConfirmPassword: "", Role: "USER" });
      setError(null); // Clear error message on successful submission
      onSubmit();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to add user: ${err.response.data.message || err.message}`);
      } else {
        setError('Failed to add user');
      }
      console.error('Failed to add user:', err);
    }
  };

  return (
    <div id="add-user" className="add-user">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        <div className="form-group">
          <label>
            Email:
            <input type="email" name="Email" value={formData.Email} onChange={handleChange} />
          </label>
          <label>
            Username:
            <input type="text" name="Username" value={formData.Username} onChange={handleChange} />
          </label>
          <label>
            Full Name:
            <input type="text" name="FullName" value={formData.FullName} onChange={handleChange} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input autoComplete="new-password" type="password" name="Password" value={formData.Password} onChange={handleChange} />
          </label>
          <label>
            Confirm Password:
            <input autoComplete="new-password" type="password" name="ConfirmPassword" value={formData.ConfirmPassword} onChange={handleChange} />
          </label>
          <label>
            Role:
            <select name="Role" value={formData.Role} onChange={handleChange}>
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="USER">User</option>
              <option value="ACCOUNTER">Accounter</option>
            </select>
          </label>
        </div>
        <div className="form-group full-width">
          <button className='add-user-button' type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;


