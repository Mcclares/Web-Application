import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../Navigation/Navigation';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './FileManager.css';
import Alert from 'react-bootstrap/Alert';
import { getCookie } from '../../../Utils/cookie';
import config from '../../../config';

interface FileType {
    Id: string;
    OldName: string;
    FileFolder: string;
    FileName: string;
    FilePath: string;
}

const FileManager = () => {

    const [currentPath, setCurrentPath] = useState('');
    const [folders, setFolders] = useState<string[]>([]);
    const [files, setFiles] = useState<FileType[]>([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [pathHistory, setPathHistory] = useState<string[]>([]);
    const [dragging, setDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [deletePath, setDeletePath] = useState('');
    const accessToken = getCookie('jwt');
    const [showModal, setShowModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{ type: 'file' | 'folder', name: string } | null>(null);
    
  

    const handleCloseModal = () => setShowModal(false);
        const handleShowModal = (type: 'file' | 'folder', name: string) => {
            setDeleteItem({ type, name });
            setShowModal(true);
    };
    
    const confirmDelete = async () => {
    if (!deleteItem) return;

    if (deleteItem.type === 'folder') {
        await handleDelete(deleteItem.name);
    } else {
        await handleDeleteFile(deleteItem.name);
    }

    handleCloseModal();
};


    //Рендеринг - происходит в начале странице.
    useEffect(() => {
        fetchFilesAndFolders(currentPath);
        
    });
    //Посылает запрос на сервес, какие папки и файлы есть на сервере.
    const fetchFilesAndFolders = async (path: string = "") => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/files/folders-and-files`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: { path },
            });
            setFiles(response.data.files);
            setFolders(response.data.folders);
        } catch (error) {
            console.error('Error fetching files and folders', error);
        }
    };

    //Скачивание файла
    const downloadFile = async (fileName: string) => {
        try {
            console.log(currentPath);
            const response = await axios.get(`${config.apiBaseUrl}/files/download/${fileName}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: { path: currentPath },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file', error);
           
        }
    };
    //Создание папок 
    const createFolder = async () => {
        if (!newFolderName.trim()) {
            alert("Folder name cannot be empty");
            return;
        }

        try {
            const response = await axios.post(`${config.apiBaseUrl}/files/create-folder`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: { path: currentPath, folderName: newFolderName }
            });
            setNewFolderName('');
            fetchFilesAndFolders(currentPath);
            alert(response.data.message);
        } catch (error) {
            console.error('Error creating folder', error);
            if (axios.isAxiosError(error) && error.response) {
                alert(error.response.data.message);
            } else {
                alert("An error occurred while creating the folder");
            }
        }
    };
    //Удаление папки

    const handleDelete = async (path: string) => {
    const deletePath = currentPath.length === 0 ? path : `${currentPath}/${path}`;
   
    try {
        const response = await axios.delete(`${config.apiBaseUrl}/files/delete-folder`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: { path: deletePath }
        });
        setMessage(response.data.message);
        fetchFilesAndFolders(currentPath);
    } catch (error) {
        console.error('Error deleting folder', error);
        if (axios.isAxiosError(error) && error.response) {
            setErrorMessage(error.response.data.message);
        } else {
            setErrorMessage('An error occurred while deleting the folder.');
        }
    }
};

    //уаление файла
     const handleDeleteFile = async (fileName: string) => {
             if (!fileName || !fileName.trim()) {
            alert("File ID cannot be empty");
            return;
        }

        try {
            const response = await axios.delete(`${config.apiBaseUrl}/files/${fileName}`, {
                      headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchFilesAndFolders(currentPath);
            setMessage("File deleted successfully");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("An error occurred while deleting the file");
            }
        }
    };

    //Переход вперед по папкам
    const handleFolderClick = (folder: string) => {
       
        if (pathHistory.length === 0) {
            const newPath = `${folder}`;
            setPathHistory([...pathHistory, newPath]);
            setCurrentPath(newPath)
    

            fetchFilesAndFolders();
            
        
        } else {
            const newPath = `${currentPath}/${folder}`;
            setPathHistory([...pathHistory, newPath]);
            setCurrentPath(newPath);
       
            fetchFilesAndFolders(newPath);
        
        }
   
    };
    //Переход папок назад
    const handleBackClick = () => {
        setPathHistory(prevPathHistory => {
            if (prevPathHistory.length > 1) {
                const newPathHistory = prevPathHistory.slice(0, -1);
                const previousPath = newPathHistory[newPathHistory.length - 1];
                setCurrentPath(previousPath);
                fetchFilesAndFolders(previousPath);
                return newPathHistory;
            } else if (prevPathHistory.length === 1) {
                setCurrentPath("");
                fetchFilesAndFolders("");
                return [];
            }
            return prevPathHistory;
        });
    };
    //Перекидывание файлы во внутрь
    const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const files = Array.from(event.dataTransfer.files);
            const formData = new FormData();
            files.forEach(file => formData.append('file', file));

            try {
                await axios.post(`${config.apiBaseUrl}/files/upload`, formData, {
                    headers: {
                    Authorization: `Bearer ${accessToken}`,
                    },
                    params: { path: currentPath || undefined }
                });
                fetchFilesAndFolders(currentPath);
            } catch (error) {
                
                 console.error('Error uploading file', error);
                if (axios.isAxiosError(error) && error.response) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('An error occurred while uploading the file');
                }
            }
        }
    };



    //для Drag and Drop
     const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
    };



    return (
    <div>
        <Navigation />
        <div className="controls">
            {/* <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder name"
            />
            <button onClick={createFolder}>Create Folder</button>
            <input type="file" onChange={uploadFile} /> */}
        </div>
        {errorMessage && <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
            {errorMessage}
        </Alert>}
        <div className='folders-table'>
        <table className="file-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Act</th>
                </tr>
            </thead>
            <tbody>
                <tr >
                    <td>
                        <b>Create folder</b>
                    </td>
                    <td>
                        <input type="text" value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder='New folder name'
                        />
                    </td>
                    <td>
                        <button className='create-button' onClick={() => createFolder()}>Create</button>
                    </td>
                </tr>
                {folders.map((folder, index) => (
                    <tr key={index} className="folder-row">
                        <td onClick={() => handleFolderClick(folder)}>{folder}</td>
                        <td onClick={() => handleFolderClick(folder)}>Folder</td>
                        <td>
                               <button className="delete-table-buttons" onClick={(e) => { e.stopPropagation(); handleShowModal('folder', folder); }}>Delete</button>
                        </td>
                    </tr>
                ))}
                {files.map((file, index) => (
                    <tr key={index} className="file-row">
                        <td onClick={() => downloadFile(file.OldName)}>{file.OldName}</td>
                        <td onClick={() => downloadFile(file.OldName)}>File</td>
                        <td>
                            <button  className="delete-table-buttons" onClick={() => handleShowModal('file', file.FileName)}>Delete</button>
                        </td>
                    </tr>
                ))}
                    <tr>
                        <td colSpan={3}>
                            <div
                            className={`dropzone ${dragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleFileDrop}
                        >Loading Files</div>
                        </td>
                </tr>
                <tr className='table-back-button' onClick={() => handleBackClick() }>
                    <td colSpan={3}>
                        Back
                    </td>
                </tr>
            </tbody>
            </table>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this {deleteItem?.type}?</Modal.Body>
            <Modal.Footer>
                <button className='cancel-button'  onClick={handleCloseModal}>
                    Cancel
                </button>
                <button className="delete-table-buttons"  onClick={confirmDelete}>
                    Delete
                </button>
            </Modal.Footer>
        </Modal>
    </div>
);
};

export default FileManager;


