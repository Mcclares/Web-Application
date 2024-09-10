import React, { useEffect, useState } from 'react';
import './TypingText.css';

const TypingText: React.FC = () => {
  const [text, setText] = useState('');
  const message = 'WELCOME TO OBD2 DATABASE';
  const speed = 150; // Скорость печати в миллисекундах

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText((prev) => {
        // Добавляем проверку, чтобы не добавлять символы после конца сообщения
        if (index < message.length) {
          return prev + message[index++];
        }
        clearInterval(interval);
        return prev;
      });
    }, speed);

    // Чистим интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  return <h1 className="typing-text">{text}</h1>;
};

export default TypingText;