import {StyleProps} from "../../shared/props/Props";
import styled from "styled-components";
import {Row} from "../../shared/components/Blocks";
import {ReactComponent as CloseIcon} from "../../assets/icons/close.svg";
import React from "react";
import IconButton from "../../shared/components/IconButton";

const Root = styled(Row)`
    padding: 8px;
    background: lightgray;
    border-radius: 4px;
    align-items: center;
    cursor: pointer;
    width: 130px;

  
    & > div {
        margin-left: 6px;
    }
`;

const Label = styled.span`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`

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
            <Label>{label}</Label>
            <IconButton
                icon={<CloseIcon height={12} width={12} />}
                onClick={handleRemove}
            />
        </Root>
    );
}
