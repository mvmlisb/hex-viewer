import React from "react";
import Tab, {TabProps} from "./Tab";
import {Row} from "../../shared/Blocks";

export interface Props {
    tabs: TabProps[];
}

export default function Tabs({tabs}: Props) {
    return (
        <Row>
            {tabs.map((tab, tabIndex) => (
                <Tab key={tabIndex} {...tab}></Tab>
            ))}
        </Row>
    );
}