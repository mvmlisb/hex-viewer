import {Column, Row} from "../shared/components/Blocks";
import HexViewer from "./hexViewer/HexViewer";
import DataInspector from "./dataInspector/DataInspector";
import React, {useMemo} from "react";
import TopBar from "./topBar/TopBar";
import {create} from "zustand";
import Tabs from "./tabs/Tabs";
import {ByteOrder} from "./dataInspector/ByteOrder";
import styled from "styled-components";

const EmptyData = new DataView(new ArrayBuffer(8));

const Root = styled(Column)`
    & * {
        box-sizing: border-box;
    }

    position: absolute;
    height: 100%;
    width: 100%;
    overflow-y: hidden;
`;

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

interface DataViewProps {
    data: DataView;
    setData: (data: DataView) => void;
    byteOrder: ByteOrder;
    setByteOrder: (byteOrder: ByteOrder) => void;
}

export const useDataStore = create<DataViewProps>(set => ({
    data: EmptyData,
    setData: (data: DataView) => set({data}),
    byteOrder: ByteOrder.LittleEndian,
    setByteOrder: (byteOrder: ByteOrder) => set({byteOrder})
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
        <Root>
            <TopBar />
            <Row style={{
                height: "100%",
                width: "100%"
            }}>
                <DataInspector />
                <Column>
                    <Tabs tabs={tabs} />
                    {selectedFile && <HexViewer file={selectedFile} />}
                </Column>
            </Row>
        </Root>
    );
}
