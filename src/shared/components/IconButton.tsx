import React from "react";

interface Props {
    icon: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function IconButton({icon, onClick}: Props) {
    return (
        <div onClick={onClick} className="icon-button">
            {icon}
        </div>
    );
}
