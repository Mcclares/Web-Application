import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './AccountForm.css';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CloseButton from 'react-bootstrap/CloseButton';
import InputGroup from 'react-bootstrap/InputGroup';
import { getCookie } from '../../../Utils/cookie';
import config from '../../../config';



interface AccountFormProps {
    closeEvent: () => void;
    closeEventSumbiting: () => void;
}
interface Account {
    number: string;
    company: string;
    accountName: string;
    price: number;
    date: string;
    status: string;
    file: File | null;
}

const AccountForm: React.FC<AccountFormProps> = ({ closeEvent, closeEventSumbiting } ) => {
    const [startDate, setStartDate] = useState(new Date());
    const accessToken = getCookie("jwt");
    const [errors, setErrors] = useState<string[]>([]);

  const [account, setAccount] = useState<Account>({
    number: '',
    company: '',
    accountName: '',
    price: 0,
    date: '',
    status: '',
    file: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setAccount((prevAccount) => ({
      ...prevAccount,
      file: file || null,
    }));
    };
    
    const validateForm = () => {
        const errors: string[] = [];
        if (!account.number) errors.push("Number is required");
        if (!account.company) errors.push("Company is required");
        if (!account.accountName) errors.push("Account Name is required");
        if (!account.price) errors.push("Price is required");
        if (!account.status) errors.push("Status is required");
        return errors;
    };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formErrors = validateForm();
  if (formErrors.length > 0) {
    setErrors(formErrors);
    return;
  }

  let dateMonth = ' ';
  if (startDate.getMonth() < 10) {
    dateMonth = '0' + String(startDate.getMonth() + 1);
  } else {
    dateMonth = String(startDate.getMonth() + 1);
  }
  const dateString = String(startDate.getDate()) + "/" + dateMonth + '/' + String(startDate.getFullYear());

  const formData = new FormData();
  formData.append('number', account.number);
  formData.append('company', account.company);
  formData.append('accountName', account.accountName);
  formData.append('price', String(account.price));
  formData.append('date', dateString);
  formData.append('status', String(account.status));
  if (account.file) {
    formData.append('file', account.file);
  }

  try {
    await axios.post(`${config.apiBaseUrl}/accounts/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setAccount({
      number: '',
      company: '',
      accountName: '',
      price: 0,
      date: '',
      status: '',
      file: null,
    });

    closingButtonClick();
    closeEventSumbiting();
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

    const closingButtonClick = () => {
    // Вызываем closeEvent при клике на кнопку
        closeEvent();
    };
   


  return (
      <Form className='AccountForm' onSubmit={handleSubmit} style={{ padding:'35px'}} >

        {errors.length > 0 && (
        <div className="error-messages">
            {errors.map((error, index) => (
            <div key={index} className="error">{error}</div>
            ))}
        </div>
        )}

        <CloseButton onClick={closingButtonClick} style={{ marginLeft:"auto", marginBottom:'2rem'}}  />
          
        <InputGroup className="mb-3">
            
            <Form.Control
            placeholder="Number"
            aria-label="number"
            aria-describedby="basic-addon1"
            type='text'
            name="number"
            value={account.number}
            onChange={handleChange} 
                  
            />
          </InputGroup>
            
          <InputGroup className="mb-3">
            <Form.Control
            placeholder="Сompany"
            aria-label="company"
            aria-describedby="basic-addon1"
            type='text'
            name="company"
            value={account.company}
            onChange={handleChange} 

            />
          </InputGroup>
        
          <InputGroup className="mb-3">
            <Form.Control
            placeholder="Account Name"
            aria-label="accountName"
            aria-describedby="basic-addon1"
            type='text'
            name="accountName"
            value={account.accountName}
            onChange={handleChange} 

            />
          </InputGroup>
            <InputGroup className="mb-3">
            <Form.Control
            placeholder="Price"
            aria-label="number"
            aria-describedby="basic-addon1"
            type="number"
            name="price"
            value={account.price}
            onChange={handleChange} 

            />
          </InputGroup>
           <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} />
            <select name="status" value={account.status} onChange={handleChange}>
                     <option value="">Select Status</option>
                     <option value="payed">Payed</option>
              <option value="unpayed">Unpayed</option>
           </select>
      
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>File input</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
       
        

          <button className='submit-buttons-table'  type="submit" >Submit</button>
    </Form>
  );
};

export default AccountForm;


