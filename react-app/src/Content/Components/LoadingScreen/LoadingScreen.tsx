import React from 'react';
import './LoadingScreen.css';
import Navigation from '../Navigation/Navigation';
import spriteSheet from "../CustomAnimationSpinner/Sprite-0003.png"; // Убедитесь, что путь к файлу правильный
import CustomAnimation from '../CustomAnimationSpinner/CustomAnimation';
const LoadingScreen: React.FC = () => {
  return (
      <div className="loading-screen">
          <Navigation />
           <CustomAnimation 
                spriteSheet={spriteSheet} 
                frameWidth={95} // Ширина одного кадра
                frameHeight={95} // Высота одного кадра
                frameCount={3} // Количество кадров
                frameDuration={250} // Продолжительность одного кадра в миллисекундах
                />
      
    </div>
  );
};

export default LoadingScreen;