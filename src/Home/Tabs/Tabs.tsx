import React from "react";
import Tab, {TabProps} from "./Tab";
import {Row} from "../../Common/Blocks";

export interface Props {
    tabs: TabProps[];
}

export default function Tabs({tabs}: Props) {
    return <Row>
        {tabs.map((tab) => <Tab {...tab}></Tab>)}
    </Row>
}