import React from 'react';
import {Button, Upload} from 'antd';


export const UploadFile = () => {

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const fileHandler = async ({onSuccess, onError, file}) => {
        const base64 = await toBase64(file);
        const body = {
            'file': base64,
            'fileName': file.name,
        };
        const res = await window.electron.dbApi.mongoUploadAuditFile(body);
        console.log("FILE UPLOAD RESPONSE: ", res)
        if (res.isSuccess) {
            onSuccess('ok');
        } else {
            onError('error');
        }
    };


    return (
        <Upload
            // @ts-ignore
            customRequest={fileHandler}>
            <Button>Upload</Button>
        </Upload>
    );
};
