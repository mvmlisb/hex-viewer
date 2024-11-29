import {StyleProps} from "../../Common/Props";
import styled from "styled-components";
import {Row} from "../../Common/Blocks";
import {ReactComponent as CloseIcon} from "../../assets/icons/close.svg";
import React from "react";

const Root = styled(Row)`
    padding: 8px;
    background: lightgray;
    border-radius: 4px;
    align-items: center;
    cursor: pointer;

    & > div {
        margin-left: 6px;
    }
`;

export interface TabProps extends StyleProps {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

export default function Tab({
    label,
    isSelected,
    onSelect,
    onRemove,
    ...rest
}: TabProps) {
    const handleRemove = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onRemove();
    };
    return (
        <Root {...rest} onClick={onSelect}>
            {label}
            <div onClick={handleRemove}>
                <CloseIcon height={12} width={12} />
            </div>
        </Root>
    );
}
