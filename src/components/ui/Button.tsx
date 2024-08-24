import React from 'react';
// eslint-disable-next-line no-unused-vars 
interface ButtonProps {
    color?: string;
    style: string;
    onClick: () => void;
    children: React.ReactNode;
}

export default function Button({color, style, onClick, children}:ButtonProps) {
    return (
        <button style={{backgroundColor: color}} onClick={onClick} className={`${style} border-[2px] border-white bg-[${color}] uppercase px-4 py-2 rounded-[10px]`}>
            {children}
        </button>
    );
}

