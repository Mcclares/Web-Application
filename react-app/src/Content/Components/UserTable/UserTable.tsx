import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import './UserTable.css';
import { getCookie } from '../../../Utils/cookie';
import Modal from 'react-bootstrap/Modal';
import config from '../../../config';

interface DataItem {
  FullName: string;
  Role: string[];
  Version: number;
  CreatedOn: string;
  Claims: string[];
  Roles: string[];
  Logins: string[];
  Tokens: string[];
  Id: string;
  UserName: string;
  NormalizedUserName: string;
  Email: string;
  NormalizedEmail: string;
  EmailConfirmed: boolean;
  PasswordHash: string;
  SecurityStamp: string;
  ConcurrencyStamp: string;
  PhoneNumber: string | null;
  PhoneNumberConfirmed: boolean;
  TwoFactorEnabled: boolean;
  LockoutEnd: string | null;
  LockoutEnabled: boolean;
  AccessFailedCount: number;
  CurrentRole: string;
}

interface DataTableProps {}

const UserTable = forwardRef<{ fetchData: () => void }, DataTableProps>((props, ref) => {
  const [data, setData] = useState<DataItem[]>([]);
  const accessToken = getCookie('jwt');
  const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
    
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
 
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.apiBaseUrl}/authenticate/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Получаем токен из куки
        }
      });

      // Добавьте проверку, что response.data является массивом
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
    };
    
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (id: string) => {
        setUserToDelete(id);
        setShowModal(true);
};

  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  useEffect(() => {
    fetchData();
  }, []);
  
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
        await axios.delete(`${config.apiBaseUrl}/authenticate/users/delete/${userToDelete}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        setData(data.filter(item => item.Id !== userToDelete));
        setUserToDelete(null);
        handleCloseModal();
    } catch (err) {
        setError('Failed to delete user');
    }
};

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Удаление пользователя
  const handleDelete = async (id: string) => {
    try {
        await axios.delete(`${config.apiBaseUrl}/authenticate/users/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
      });
      setData(data.filter(item => item.Id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
    }
    return (
    <div className='table'>
        <table className='data-table'>
            <thead>
                <tr>
                    <th>Roles</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.Id}>
                        <td>{capitalizeFirstLetter(item.CurrentRole)}</td>
                        <td>{item.FullName}</td>
                        <td>{item.Email}</td>
                        <td>
                            <button className='deleteButton' onClick={() => handleShowModal(item.Id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
            <Modal.Footer>
                <button className='modal-cancel-buttons' onClick={handleCloseModal}>
                    Cancel
                </button>
                <button className='modal-delete-buttons'  onClick={confirmDelete}>
                    Delete
                </button>
            </Modal.Footer>
        </Modal>
    </div>
);

});

export default UserTable;














