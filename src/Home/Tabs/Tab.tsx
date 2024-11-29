import {StyleProps} from "../../Common/Props";
import styled from "styled-components";
import {Row} from "../../Common/Blocks";

const TabComponent = styled(Row)`
    padding: 8px;
`


export interface TabProps extends StyleProps {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

export default function Tab({label, isSelected, onSelect, onRemove, ...rest}: TabProps) {
    return <TabComponent {...rest} onClick={onSelect}>
        {label}
    </TabComponent>


}