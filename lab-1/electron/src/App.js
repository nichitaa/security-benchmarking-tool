import { useEffect, useState } from 'react';
import './App.css';
import api from './services/api';
import { Button, Upload, Typography, notification, Divider, List, Popover } from 'antd';
import fileDownload from 'js-file-download';
import { DeleteOutlined } from '@ant-design/icons';


const { Title } = Typography;


const App = () => {

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        const res = await api.get('/');
        const data = res.data;
        console.log('files: ', data);
        setFiles(files => data.files);
        setLoading(false);
    };

    const openNotification = (type, msg, description) => {
        notification[type]({
            message: msg,
            description: description
        });
    };

    const handleFileUpload = async ({ file, onSuccess, onError }) => {
        const resExists = await api.get('/exists/' + file.name);
        const exists = resExists.data.exists;
        console.log('exists: ', exists);
        if (exists) {
            openNotification('error', 'Error on file upload', 'The file with the same name already exists!');
            onError('error');
        } else {
            const form = new FormData();
            form.append('file', file, file.name);
            form.append('fileName', file.name);
            const res = await api.post('/', form)
                .then(res => res.data)
                .catch(err => err);
            console.log('uploaded file: ', res);
            if (res.isSuccess) {
                openNotification('success', 'File uploaded', 'The file was successfully uploaded');
                fetchFiles().then(res => {
                    onSuccess('ok');
                });
            } else {
                openNotification('error', 'Error on upload', 'Server error on file upload');
                onError('error');
            }
        }

    };

    const handleFileDownload = async (filename) => {
        console.log('filename: ', filename);
        api.get('/download/' + filename, {
            responseType: 'blob'
        })
            .then((res) => {
                fileDownload(res.data, filename);
            });
    };

    const deleteFile = async (filename) => {
        const res = await api.delete('/' + filename);
        console.log('delete res: ', res);
        const isSuccess = res.data.isSuccess;
        if (isSuccess) {
            openNotification('success', 'File deleted', 'The file: ' + filename + ' was successfully deleted!');
            fetchFiles();
        } else {
            openNotification('error', 'Error', 'The file: ' + filename + ' was not deleted :(');
        }
    };

    return (
        <div className="App">
            <Title
                style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}
                level={4}>CS - upload audit files</Title>
            <Divider/>
            <Upload
                style={{
                    width: '100%'
                }}
                fileList={[]}
                customRequest={handleFileUpload}>
                <Button style={{ width: '100%' }}>Upload</Button>
            </Upload>

            <Divider/>
            {/*<Button*/}
            {/*    style={{ width: '100%' }}*/}
            {/*    onClick={fetchFiles}>Refresh</Button>*/}
            {/*<Divider/>*/}
            <List
                style={{
                    overflow: 'hidden'
                }}
                loading={loading}
                size="small"
                header={<p>Archive:</p>}
                bordered
                dataSource={files}
                renderItem={item => <List.Item
                    style={{ cursor: 'pointer', display: 'flex' }}>
                    <p onClick={() => handleFileDownload(item.fileName)}>{item.fileName}</p> <Button
                    onClick={() => {
                        deleteFile(item.fileName);
                    }}
                    danger
                    size={'small'}><DeleteOutlined/></Button>
                </List.Item>}
            />
        </div>
    );
};

export default App;
