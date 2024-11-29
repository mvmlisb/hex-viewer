import {useFilesStore} from "../MainPage";
import {useCallback} from "react";

export default function FileSelectorButton() {

    const addFile = useFilesStore((state) => state.addFile);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFile(e.target.files[0]);
        }
    }, [addFile]);


    return (
        <div>
        <input type="file" onChange={handleFileChange} />
        </div>
    );
}