import {Column, Row} from "../shared/Blocks";
import HexViewer from "./hexViewer/HexViewer";
import DataInspector from "./dataInspector/DataInspector";
import React, {useMemo} from "react";
import TopBar from "./topBar/TopBar";
import {create} from "zustand";
import Tabs from "./tabs/Tabs";

interface FileProps {
    files: File[];
    addFile: (file: File) => void;
    removeFile: (file: File) => void;
    selectedFile: File | null;
    setSelectedFile: (file: File) => void;
}

export const useFilesStore = create<FileProps>(set => ({
    files: [],
    addFile: (file: File) => set(state => ({files: [...state.files, file]})),
    removeFile: (file: File) =>
        set(state => ({
            files: state.files.filter(
                f => file.webkitRelativePath !== f.webkitRelativePath
            )
        })),
    selectedFile: null,
    setSelectedFile: (file: File) => set({selectedFile: file})
}));

export default function MainPage() {
    const files = useFilesStore(state => state.files);
    const selectedFile = useFilesStore(state => state.selectedFile);
    const setSelectedFile = useFilesStore(state => state.setSelectedFile);
    const removeFile = useFilesStore(state => state.removeFile);

    const tabs = useMemo(
        () =>
            files.map(file => ({
                label: file.name,
                isSelected: file === selectedFile,
                onSelect: () => setSelectedFile(file),
                onRemove: () => removeFile(file)
            })),
        [files, selectedFile, setSelectedFile, removeFile]
    );

    return (
        <Column>
            <TopBar />
            <Row>
                <Column>
                    <Tabs tabs={tabs} />
                    {selectedFile && <HexViewer file={selectedFile} />}
                </Column>
                <DataInspector />
            </Row>
        </Column>
    );
}