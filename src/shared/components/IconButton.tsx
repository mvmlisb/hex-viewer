import React from "react";
import {StyleProps} from "../props/Props";

interface Props extends StyleProps {
    icon: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function IconButton({icon, onClick, ...rest}: Props) {
    return (
        <div onClick={onClick} {...rest}>
            {icon}
        </div>
    );
}
