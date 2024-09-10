import React, { useRef, useState } from "react";
import Navigation from '../Navigation/Navigation';
import Card from 'react-bootstrap/Card';
import image from '../Background-images/Card.png';
import './MyAccount.css';
import AddUserForm from './AddUserForm';
import UserTable from './UserTable';

export default function MyAccount() {
  const [toggle, setToggle] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const fullName = localStorage.getItem('fullName');
  const dataTableRef = useRef<{ fetchData: () => void }>(null);

  const handleButtonClick = () => {
    setToggle(!toggle);
    setClicked(true);
    setTimeout(() => setClicked(false), 200); // Remove the click effect after 200ms
  };

  const handleFormSubmit = () => {
    setToggle(false); // Hide the form
    setShowSuccessMessage(true); // Show success message
    dataTableRef.current?.fetchData(); // Refresh data
    setTimeout(() => setShowSuccessMessage(false), 10000); // Hide the success message after 10 seconds
  };

  return (
      <div>
        <Navigation />
        <div className='myAccountContainer'>
          <div className='personCard'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={image} />
              <Card.Body>
                <Card.Title>Hello, {fullName}!</Card.Title>
              </Card.Body>
            </Card>
          </div>
          <UserTable ref={dataTableRef} /> {/* Pass the ref */}
          <button
              className='just-button'
              onClick={handleButtonClick}
          >
            Create
          </button>
          {showSuccessMessage && <div className="success-message">User added successfully!</div>}
        </div>
        <div className={`addUserFormContainer ${toggle ? 'show' : ''}`}>
          <AddUserForm onSubmit={handleFormSubmit} />
        </div>
      </div>
  );
}


// import React, { useRef, useState } from "react";
// import Navigation from '../Navigation/Navigation';
//
// import Card from 'react-bootstrap/Card';
// import image from '../Background-images/Card.png';
// import './MyAccount.css';
// import AddUserForm from './AddUserForm';
// import UserTable from './UserTable';
//
// export default function MyAccount() {
//   const [toggle, setToggle] = useState<boolean>(false);
//   const [clicked, setClicked] = useState<boolean>(false);
//   const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
//
//   const fullName = localStorage.getItem('fullName');
//   const dataTableRef = useRef<{ fetchData: () => void }>(null);
//
//   const handleButtonClick = () => {
//     setToggle(!toggle);
//     setClicked(true);
//     setTimeout(() => setClicked(false), 200); // Remove the click effect after 200ms
//   };
//
//   const handleFormSubmit = () => {
//     setToggle(false); // Hide the form
//     setShowSuccessMessage(true); // Show success message
//     dataTableRef.current?.fetchData(); // Refresh data
//     setTimeout(() => setShowSuccessMessage(false), 10000); // Hide the success message after 10 seconds
//   };
//
//   return (
//     <div>
//       <Navigation />
//       <div className='myAccountContainer'>
//         <div className='personCard'>
//           <Card style={{ width: '18rem' }}>
//             <Card.Img variant="top" src={image} />
//             <Card.Body>
//               <Card.Title>Hello, {fullName}!</Card.Title>
//             </Card.Body>
//           </Card>
//         </div>
//         <UserTable ref={dataTableRef} /> {/* Pass the ref */}
//         <button
//           className={clicked ? 'button-clicked' : 'just-button'}
//           onClick={handleButtonClick}
//         >
//           Create
//         </button>
//         {showSuccessMessage && <div className="success-message">User added successfully!</div>}
//       </div>
//       <div className={`addUserFormContainer ${toggle ? 'show' : ''}`}>
//         <AddUserForm onSubmit={handleFormSubmit} />
//       </div>
//     </div>
//   );
// }
//

