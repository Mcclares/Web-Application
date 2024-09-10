import TypingText from "./TypingText";
import Navigation from "../Navigation/Navigation";

import CustomAnimation from "../CustomAnimationSpinner/CustomAnimation";
import spriteSheet from "../CustomAnimationSpinner/Sprite-0003.png";
export default function Home() {
    return (
        <div>
            <Navigation />
            <TypingText />
              <CustomAnimation 
                spriteSheet={spriteSheet} 
                frameWidth={95} // Ширина одного кадра
                frameHeight={95} // Высота одного кадра
                frameCount={3} // Количество кадров
                frameDuration={250} // Продолжительность одного кадра в миллисекундах
                />
            {/* <LoadingSpinner/> */}
        </div>
    );
}