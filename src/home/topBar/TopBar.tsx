import {Row} from "../../shared/Blocks";
import React, {useCallback} from "react";
import FileSelectorButton from "./FileSelectorButton";
import {useFilesStore} from "../MainPage";

export default function TopBar() {
    const addFile = useFilesStore(state => state.addFile);
    const setSelectedFile = useFilesStore(state => state.setSelectedFile);
    const handleFileChange = useCallback(
        (files: FileList | null) => {
            if (files) {
                const file = files[0];
                addFile(file);
                setSelectedFile(file);
            }
        },
        [addFile, setSelectedFile]
    );
    return (
        <Row>
            <FileSelectorButton onChange={handleFileChange} />
        </Row>
    );
}
