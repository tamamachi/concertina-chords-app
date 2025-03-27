import React from 'react';
import keymap from '../data/keymap.json'; // Import keymap data

const renderLeftHandButtons = (leftButtonColors) => {
    const positions = [
        { x: 50, y: 150 }, { x: 100, y: 150 }, { x: 150, y: 150 }, { x: 200, y: 150 }, { x: 250, y: 150 }, { x: 300, y: 150 },
        { x: 50, y: 200 }, { x: 100, y: 200 }, { x: 150, y: 200 }, { x: 200, y: 200 }, { x: 250, y: 200 }, { x: 300, y: 200 },
        { x: 50, y: 250 }, { x: 100, y: 250 }, { x: 150, y: 250 }, { x: 200, y: 250 }, { x: 250, y: 250 }, { x: 300, y: 250 },
        { x: 300, y: 300 } // L19 button moved below L18
    ];
    return (
        <>
            <polygon
                points="175,50 350,125 350,325 175,400 0,325 0,125"
                fill="none"
                stroke="black"
                strokeWidth="2"
            />
            {positions.map((pos, index) => {
                const button = keymap['40-button'].left[index]?.button || `L${index + 1}`;
                const color = leftButtonColors[button] || 'white';
                return (
                    <g key={`left-${index}`}>
                        <circle cx={pos.x} cy={pos.y} r="20" fill={color} stroke="black" />
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="12" fill="black">{button}</text>
                    </g>
                );
            })}
        </>
    );
};

const renderRightHandButtons = (rightButtonColors) => {
    const positions = [
        { x: 450, y: 150 }, { x: 500, y: 150 }, { x: 550, y: 150 }, { x: 600, y: 150 }, { x: 650, y: 150 }, { x: 700, y: 150 }, { x: 750, y: 150 },
        { x: 450, y: 200 }, { x: 500, y: 200 }, { x: 550, y: 200 }, { x: 600, y: 200 }, { x: 650, y: 200 }, { x: 700, y: 200 },
        { x: 450, y: 250 }, { x: 500, y: 250 }, { x: 550, y: 250 }, { x: 600, y: 250 }, { x: 650, y: 250 }, { x: 700, y: 250 },
        { x: 500, y: 300 }, // R20 button moved below R15
        { x: 650, y: 300 } // R21 button moved two buttons to the right
    ];
    return (
        <>
            <polygon
                points="600,50 775,125 775,325 600,400 425,325 425,125"
                fill="none"
                stroke="black"
                strokeWidth="2"
            />
            {positions.map((pos, index) => {
                const button = keymap['40-button'].right[index]?.button || `R${index + 1}`;
                const color = rightButtonColors[button] || 'white';
                return (
                    <g key={`right-${index}`}>
                        <circle cx={pos.x} cy={pos.y} r="20" fill={color} stroke="black" />
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="12" fill="black">{button}</text>
                    </g>
                );
            })}
        </>
    );
};

const KeyboardDiagram = ({ leftButtonColors = {}, rightButtonColors = {} }) => {
    return (
        <svg
            viewBox="0 0 800 400" // SVG全体の座標系を定義
            width="100%" // 横幅を親要素に合わせる
            height="auto" // 高さを自動調整
        >
            {renderLeftHandButtons(leftButtonColors)}
            {renderRightHandButtons(rightButtonColors)}
        </svg>
    );
};

export default KeyboardDiagram;
