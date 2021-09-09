import {useEffect, useState} from 'react';
import ReactJson from 'react-json-view'
import './App.css';
import api from './services/api';
import {
    message,
    Button,
    Upload,
    Typography,
    notification,
    Divider,
    List,
    Popconfirm,
    Modal
} from 'antd';
import fileDownload from 'js-file-download';
import {DeleteOutlined} from '@ant-design/icons';


const {Title} = Typography;


const App = () => {

    type File = {
        audit_file: {
            filename: string
        },
        audit_display_name: string
    };

    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

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

    const handleFileUpload = async ({file, onSuccess, onError}) => {
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
                message.success('File uploaded successfully!', 2);
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
            message.success('File deleted successfully!', 2);
            fetchFiles();
        } else {
            openNotification('error', 'Error', 'The file: ' + filename + ' was not deleted :(');
        }
    };

    return (
        <div className="App">
            <Title
                style={{textAlign: 'center', color: '#555b6e'}}
                level={4}> CS - Audit files</Title>
            <Divider/>
            <Upload
                style={{
                    width: '100%'
                }}
                fileList={[]}
                // @ts-ignore
                customRequest={handleFileUpload}>
                <Button
                    type={'primary'}
                    style={{width: '100%'}}>Upload</Button>
            </Upload>

            <Divider/>
            <List
                style={{overflow: 'hidden'}}
                loading={loading}
                size="small"
                header={<p style={{marginBottom: 0}}>Archive:</p>}
                bordered
                dataSource={files}
                renderItem={item => <List.Item
                    style={{display: 'flex'}}>
                    <Popconfirm
                        title={''}
                        onConfirm={() => {
                            handleFileDownload(item.audit_file.filename);
                        }}
                        onCancel={() => {
                            setModalIsVisible(true)
                        }}
                        okText="Download"
                        cancelText="View Parsed"
                    >
                        <p
                            style={{
                                cursor: 'pointer',
                                width: '90%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginBottom: 0
                            }}>{item.audit_file.filename}</p>
                    </Popconfirm>

                    <Popconfirm
                        title={''}
                        onConfirm={() => {
                            deleteFile(item.audit_file.filename);
                        }}
                        onCancel={() => message.info(`You're right!`, 0.7)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <DeleteOutlined style={{color: 'red'}}/>
                    </Popconfirm>

                    <Modal style={{width: '100%'}} title={`${item.audit_display_name}`}
                           visible={modalIsVisible}
                           closable={true}
                           onCancel={() => setModalIsVisible(false)}
                           onOk={() => setModalIsVisible(false)}
                    >
                        <ReactJson
                            displayObjectSize={true}
                            enableClipboard={false}
                            indentWidth={2}
                            collapseStringsAfterLength={40}
                            collapsed={1}
                            src={item}
                            theme={'bright:inverted'}
                            displayDataTypes={false}
                        />
                    </Modal>

                </List.Item>}
            />
        </div>
    );
};

export default App;
