import React from "react";

const diceFaces = [
  [], // Empty for 0 value (dice starts from 1)
  [[50, 50]], // 1 dot (centered)
  [[25, 25], [75, 75]], // 2 dots (top-left and bottom-right)
  [[25, 25], [50, 50], [75, 75]], // 3 dots (top-left, center, and bottom-right)
  [[25, 25], [25, 75], [75, 25], [75, 75]], // 4 dots (corners)
  [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]], // 5 dots (corners + center)
  [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]], // 6 dots (3 rows)
];

export default function Die(props) {
  const dots = diceFaces[props.value];
  const styles = {
      backgroundColor: props.isHeld ? "#59E391" : "white"
  }

  return (
    <div
        className="die-face"
        style={styles}
        onClick={props.holdDice}
    >
      <svg viewBox="0 0 100 100" width="100" height="100">
        {dots.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="8" fill="black" />
        ))}
      </svg>
    </div>
  );
}
