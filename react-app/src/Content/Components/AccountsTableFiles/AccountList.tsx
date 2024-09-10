import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './AccountList.css';
// import CreatingAccount from './CreatingAccount';
import EditAccount from './EditAccount';
import blankDoc from '../Background-images/icons/Remove-Folder.png';

import Table from 'react-bootstrap/Table';

import "bootstrap/dist/css/bootstrap.min.css"
import AccountForm from './AccountForm';
import Alert from 'react-bootstrap/Alert';
import { getCookie } from '../../../Utils/cookie';
import config from '../../../config'

interface Account {
    Id: string;
    Number: number;
    Company: string;
    AccountName: string;
    Price: number;
    Date: string;
    Status: string;
    FileName: string;
}

const AccountList: React.FC = () => {

    const accessToken = getCookie('jwt');
    
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
    const [showAlert, setShowAlert] = useState(false);

    const [searchCriteria, setSearchCriteria] = useState<{ field: string; value: string }>({
        field: 'Number',
        value: '',
    });

    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = (id: string) => {
        const selected = filteredAccounts.find(account => account.Id === id);
        if (selected) {
            setSelectedAccount(selected);
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedAccount(null);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/accounts`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
           
            setAccounts(response.data);
        } catch (error) {
            console.error('Ошибка при получении учетных записей:', error);
        }
    };

    useEffect(() => {
        fetchData();
    },[]);


    useEffect(() => {
        // Фильтрация учетных записей по критериям поиска
        const filtered = accounts.filter((account: Account) =>
            String(account[searchCriteria.field as keyof Account])
                .toLowerCase()
                .includes(searchCriteria.value.toLowerCase())
        );
        setFilteredAccounts(filtered);
    }, [searchCriteria, accounts]);


    //Логика удаление
    //выбранный
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");

    const handleDelete = () => {


        axios.delete(`${config.apiBaseUrl}/accounts/${selectedAccountId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Добавление токена в заголовок
                }
            })
            .then(response => {
                // Обновить список учетных записей после удаления
                const updatedAccounts = accounts.filter(account => account.Id !== selectedAccountId);
                setAccounts(updatedAccounts);
                handleCloseAlert();
                setSelectedAccountId(" ");
            })
            .catch(error => {
                console.error('Ошибка при удалении учетной записи:', error);
            });
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const handleShowAlert = (id: string) => {
        setSelectedAccountId(id);
        setShowAlert(true);
    };

    //открытие popUp

    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleSubmit = async () => {
        await fetchData(); // После успешной отправки формы обновляем данные

    };


    return (
        <div className='original'>
            <div>
                <select className='SearchSelect'
                        onChange={(e) => setSearchCriteria({...searchCriteria, field: e.target.value})}
                        defaultValue="Number">
                    <option className='SearchOption' value="Number">Number</option>
                    <option className='SearchOption' value="Company">Company</option>
                    <option className='SearchOption' value="AccountName">Account name</option>
                    <option className='SearchOption' value="Price">Price</option>
                    <option className='SearchOption' value="Date">Date</option>
                    <option className='SearchOption' value="Status">Status</option>

                </select>
                <input className='SearchInput'
                       type="text"
                       value={searchCriteria.value}
                       onChange={(e) => setSearchCriteria({...searchCriteria, value: e.target.value})}
                />

            </div>


            <div style={{overflowY: filteredAccounts.length > 10 ? 'scroll' : 'hidden', maxHeight: '700px'}}>
                <Table bordered={true} style={{borderRadius: 5, textAlign: 'center'}}>
                    <thead>
                    <tr>
                        <th>Number</th>
                        <th>Company</th>
                        <th>Account Name</th>
                        <th>Price</th>
                        <th>File</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Act</th>

                    </tr>
                    </thead>
                    <tbody>
                    {filteredAccounts.map(account => (
                        <tr key={account.Id}>
                            <td>{account.Number}</td>
                            <td>{account.Company}</td>
                            <td>{account.AccountName}</td>
                            <td>{account.Price}</td>
                            <td>
                                {account.FileName ? (
                                    <a href={`${config.apiBaseUrl}/accounts/${account.FileName}`} target="_blank"
                                       rel="noopener noreferrer">
                                        Open file
                                    </a>
                                ) : (
                                    <img src={blankDoc} alt="Default"/>
                                )}
                            </td>
                            <td>
                                {account.Date}
                            </td>
                            <td>
                                {account.Status}
                            </td>
                            <td>
                                <button className='edit-buttons' onClick={() => handleEdit(account.Id)}>Edit </button>{' '}
                                <button className='delete-table-buttons'
                                        onClick={() => handleShowAlert(account.Id)}>Delete</button>{' '}
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <button className='new-account' onClick={toggleForm}> New Account</button>
            {/* CreatingWindows */}
            {showForm && (
                <div className='CreatingWindow'>

                    <AccountForm closeEvent={toggleForm} closeEventSumbiting={handleSubmit} />
                </div>
                )}
            {/* edititngWindows */}
            <div>
                {isEditing && selectedAccount && (
                    <div className='EditingWindows'>
                        <EditAccount
                            account={selectedAccount}
                            onUpdate={(updatedAccount: Account) => {
                                // Обновление данных учетной записи после успешного редактирования
                                // Например, отправка запроса на сервер для обновления списка учетных записей
                                // и скрытие формы редактирования
                                setIsEditing(false);
                                setSelectedAccount(null);
                            }}
                            onCancel={handleCancelEdit}
                            closeEventSumbiting={handleSubmit}

                        />
                    </div>

                )}

            </div>
            {/* alert */}
            <div>
                {showAlert && (
                    <div className='alertBackground'>
                        <div className="centered-alert-overlay">
                            <Alert show={showAlert} variant="success">
                                <Alert.Heading>Are you sure?</Alert.Heading>
                                <p>
                                    Attention! Deleting this item will lead to stunning cosmic events and temporal
                                    paradoxes.
                                    You might open a portal to another reality or awaken ancient dragons. Prepare for
                                    fantastic consequences!
                                </p>
                                <hr/>
                                <div className="d-flex justify-content-end">
                                    <button className='close-btn' onClick={handleCloseAlert} >
                                        Close me
                                    </button>
                                    <button className='delete-btn'  style={{marginLeft: '10px'}} onClick={handleDelete}
                                            >
                                        Delete
                                    </button>
                                </div>
                            </Alert>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );

};

export default AccountList;









