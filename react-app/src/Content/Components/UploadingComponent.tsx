import React from 'react';

interface FileUploadComponentProps {
  onFileChange: (file: File | null) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onFileChange }) => {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onFileChange(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      Drag & Drop files here
    </div>
  );
};

export default FileUploadComponent;



// import React from 'react';

// interface FileUploadComponentProps {
//   onFileChange: (file: File | null) => void;
// }

// const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onFileChange }) => {
//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     if (event.dataTransfer.items) {
//       const file = event.dataTransfer.items[0].getAsFile();
//       onFileChange(file);
//     }
//   };

//   return (
//     <div
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//       style={{
//         border: '2px dashed #ccc',
//         padding: '20px',
//         textAlign: 'center',
//         cursor: 'pointer',
//       }}
//     >
//       Drag & Drop file here
//     </div>
//   );
// };

// export default FileUploadComponent;