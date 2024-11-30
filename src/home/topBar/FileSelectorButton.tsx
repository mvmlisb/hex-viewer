import React, {useCallback} from "react";

interface Props {
    onChange: (files: FileList | null) => void;
}

export default function FileSelectorButton({onChange}: Props) {
    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.files);
        },
        [onChange]
    );

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
}
