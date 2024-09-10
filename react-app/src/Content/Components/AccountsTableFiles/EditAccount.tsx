import React, {useState, ChangeEvent} from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CloseButton from 'react-bootstrap/CloseButton';
import InputGroup from 'react-bootstrap/InputGroup';
import { getCookie } from '../../../Utils/cookie';
import config from '../../../config'


type Account = {
    Id: string;
    Number: number;
    Company: string;
    AccountName: string;
    Price: number;
    Date: string;
    Status: string;
    FileName: string;
}


interface EditAccountProps {

    account: Account;
    onUpdate: (updatedAccount: Account) => void;
    onCancel: () => void;
    closeEventSumbiting: () => void;

}

const EditAccount: React.FC<EditAccountProps> = ({account, onUpdate, onCancel, closeEventSumbiting}) => {

    const accessToken = getCookie('jwt');
    const [editedAccount, setEditedAccount] = useState<Account>({...account});
    const [startDate, setStartDate] = useState(new Date());

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEditedAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setEditedAccount((prevAccount) => ({
            ...prevAccount,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.put(`${config.apiBaseUrl}/accounts/${account.Id}`, editedAccount, {
                headers: {

                    Authorization: `Bearer ${accessToken}`,
                },
            });
            onUpdate(response.data);
            closeEventSumbiting();
        } catch (error) {
            console.error('Ошибка при обновлении учетной записи:', error);
        }
    };


    return (
        <div className="edit-account">
            <Form onSubmit={handleSubmit} style={{padding: '35px'}}>

                <CloseButton onClick={onCancel} style={{marginLeft: "auto", marginBottom: '2rem'}}/>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">No.</InputGroup.Text>
                    <Form.Control
                        placeholder="Number"
                        aria-label="Number"
                        aria-describedby="basic-addon1"
                        type='text'
                        name="Number"
                        value={editedAccount.Number}
                        onChange={handleChange}
                        style={{marginBottom: '0px'}}

                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Co.</InputGroup.Text>
                    <Form.Control
                        placeholder="Сompany"
                        aria-label="Company"
                        aria-describedby="basic-addon1"
                        type='text'
                        name="Company"
                        value={editedAccount.Company}
                        onChange={handleChange}
                        style={{marginBottom: '0px'}}

                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Ac.Name</InputGroup.Text>
                    <Form.Control
                        placeholder="Account Name"
                        aria-label="AccountName"
                        aria-describedby="basic-addon1"
                        type='text'
                        name="AccountName"
                        value={editedAccount.AccountName}
                        onChange={handleChange}
                        style={{marginBottom: '0px'}}

                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Price</InputGroup.Text>
                    <Form.Control
                        placeholder="Price"
                        aria-label="number"
                        aria-describedby="basic-addon1"
                        type="number"
                        name="Price"
                        value={editedAccount.Price}
                        onChange={handleChange}
                        style={{marginBottom: '0px'}}

                    />
                </InputGroup>
                <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)}/>
                <select name="Status" value={editedAccount.Status} onChange={handleSelectChange}>
                    <option value="">Select Status</option>
                    <option value="payed">Payed</option>
                    <option value="unpayed">Unpayed</option>
                </select>

                <button className='submit-buttons-table' type="submit">Submit</button>
            </Form>

        </div>
    );
};

export default EditAccount;


