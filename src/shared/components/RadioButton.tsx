import React from "react";

interface Props {
    name: string;
    value: string;
    checked: boolean;
    label: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioButton({
    name,
    value,
    checked,
    label,
    onChange
}: Props) {
    return (
        <div>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={value}>{label}</label>
        </div>
    );
}
