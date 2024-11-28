import React, { FC, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export interface TFile {
    name: string;
    type: string;
    size: number | string;
    base64: string | ArrayBuffer | null;
    file: any;
}

export interface FileInputProps {
    multiple?: boolean;
    accept?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    onDone?: (files: Array<TFile>, nonImageFiles?: any[]) => void;
    onChange?: (data: any) => void;
    readAs?: keyof Pick<FileReader, 'readAsDataURL' | 'readAsBinaryString'>;

    /** Will only work if multiple is false */
    withCropping?: boolean;
}

const FileInput: FC<FileInputProps> = ({
    multiple = false,
    accept = 'image/*',
    style = {},
    disabled = false,
    withCropping = false,
    onDone,
    onChange,
    readAs = 'readAsDataURL',
}) => {
    const [open, setOpen] = useState(false);
    const [croppedImage, setCroppedImage] = useState<TFile>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files || [];
        if (onChange) onChange(files[0]);

        const allFiles: Array<TFile> = [];
        const remFiles: any[] = [];

        Array.from(files).forEach((file) => {
            if (file.type.includes('image')) {
                const reader = new FileReader();
                reader.onload = () => {
                    const fileInfo: TFile = {
                        name: file.name,
                        type: file.type,
                        size: `${Math.round(file.size / 1000)} kB`,
                        base64: file.type.includes('image') ? reader.result : null,
                        file,
                    };

                    allFiles.push(fileInfo);

                    if (allFiles.length + remFiles.length === files.length) {
                        if (withCropping && allFiles.length === 1 && !multiple) {
                            setOpen(true);
                            setCroppedImage(fileInfo);
                        } else if (onDone) {
                            onDone(allFiles, remFiles);
                        }
                    }
                };

                reader[readAs](file);
            } else {
                remFiles.push(file);
                if (allFiles.length + remFiles.length === files.length && onDone) {
                    onDone(allFiles, remFiles);
                }
            }
        });
    };

    return (
        <Box sx={{ position: 'relative', ...style }}>
            <StyledInput
                type="file"
                onChange={handleChange}
                multiple={multiple}
                accept={accept}
                disabled={disabled}
            />
        </Box>
    );
};

export default FileInput;

// Styled Components
const StyledInput = styled('input')(({ theme }) => ({
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
    zIndex: 5,
}));