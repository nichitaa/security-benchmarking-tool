import React, {useEffect, useState} from 'react';
import {Button, Upload, notification, List, Divider} from 'antd';
import {saveAs} from 'file-saver';
import {hot} from 'react-hot-loader';


const UploadFile = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        updateFilesState();
    }, [])


    const updateFilesState = () => {
        setLoading(true);
        const fetchFiles = async () => {
            const files = await getFiles();
            console.log('files: ', files);
            setFiles(files);
            setLoading(false);
        };
        fetchFiles();
    }

    const getFiles = async () => {
        const res = await window.electron.dbApi.mongoGetUploadFiles();
        if (res.isSuccess) return res.data;
        else {
            notification['error']({
                message: 'GET Error',
                description: 'Can not get all documents from db',
            });
            return [];
        }
    };


    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const fileHandler = async ({onSuccess, onError, file}) => {
        console.log("File: ", file);
        const base64 = await toBase64(file);
        const body = {
            'file': base64,
            'fileName': file.name,
        };

        let docs = await getFiles();

        let exists = false;
        if (docs.length > 0) {
            for (let i = 0; i < docs.length; i++) {
                let doc = docs[i];
                if (doc.fileName === file.name) {
                    exists = true;
                    break;
                }
            }
        }

        if (!exists) {
            // upload
            const res = await window.electron.dbApi.mongoUploadAuditFile(body);
            console.log('FILE UPLOAD RESPONSE: ', res);
            if (res.isSuccess) {
                onSuccess('success');
            } else {
                onError('error');
            }
        } else {
            // file exists
            notification['error']({
                message: 'Upload Error',
                description:
                    'Audit file with the same name already exists',
            });
            onError('error');
        }
    };


    return (
        <div style={{

            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}>
            <Upload
                // @ts-ignore
                customRequest={fileHandler}>
                <Button
                    style={{width: '100%'}}
                >Upload</Button>
            </Upload>
            <br/>
            <Button style={{width: '100%'}} onClick={updateFilesState} loading={loading}>
                Fetch
            </Button>
            <Divider/>
            {files.length > 0 && <List
                loading={loading}
                size="small"
                header={<h2 style={{color: 'beige'}}>Audit File List</h2>}
                bordered
                dataSource={files}
                renderItem={file => <List.Item
                    style={{cursor: 'pointer'}}
                    onClick={(e) => {
                        console.log("downloading");
                    }}>
                    {file.fileName}
                </List.Item>}
            />}
        </div>

    );
};

export default hot(module)(UploadFile);
