import React, { useState, useEffect } from "react";

const diceFaces = [
  [],
  [[50, 50]],
  [[25, 25], [75, 75]],
  [[25, 25], [50, 50], [75, 75]],
  [[25, 25], [25, 75], [75, 25], [75, 75]],
  [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
  [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
];

export default function Die({ value, isRolling, onAnimationComplete, onHoldChange, isHeldProp }) {
    const [isHeld, setIsHeld] = useState(isHeldProp);
    const [dots, setDots] = useState(diceFaces[value]);

    const styles = {
        backgroundColor: isHeld ? "#59E391" : "white",
    };

    const handleDiceClick = () => {
        if (!isRolling) {
            setIsHeld(!isHeld);
            // Call the onHoldChange callback with the updated "isHeld" state
            onHoldChange(!isHeld);
        }
    };

    useEffect(() => {
        if (isRolling && !isHeld) {
            const interval = setInterval(() => {
                setDots(diceFaces[Math.ceil(Math.random() * 6)]);
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                setDots(diceFaces[value]);
                onAnimationComplete();
            }, 800);
        }
    }, [isRolling, value, onAnimationComplete, isHeld]);

    return (
        <div
            className={`die-face ${isRolling ? "rolling" : ""}`}
            style={styles}
            onClick={handleDiceClick}
        >
            <svg
                viewBox="0 0 100 100"
                width="100"
                height="100"
            >
                {dots.map((dot, index) => (
                    <circle
                        key={index}
                        cx={dot[0]}
                        cy={dot[1]}
                        r="8"
                        fill="black"
                    />
                ))}
            </svg>
        </div>
    );
}
