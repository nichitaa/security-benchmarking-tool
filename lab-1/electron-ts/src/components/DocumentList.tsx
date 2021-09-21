import React, {useContext} from "react";
import {
    Button,
    List,
    message,
    Popconfirm,
    Typography,
    Upload
} from "antd";
import {
    ArrowsAltOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    FileSearchOutlined,
    FileUnknownOutlined,
    FolderAddOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import {AppContext} from "../context/context";
import {
    fetchData,
    toggleIsEditView,
    toggleIsParsedView,
    updateEditViewItem,
    updateParseViewItem
} from "../context/reducer";
import {checkUniqueDocument, deleteAuditDocument, downloadAuditFile, uploadAuditDocument} from "../services/api";
import fileDownload from "js-file-download";
import {showMessage} from "../utils";

const {Title} = Typography;

export const DocumentList = () => {

    const {state, dispatch} = useContext(AppContext)
    const {files, files_loading} = state;

    const deleteFile = async (filename) => {
        deleteAuditDocument(filename)
            .then(res => {
                console.log('[deleteAuditDocument] response: ', res);
                if (res.isSuccess) {
                    showMessage('success', 'deleted successfully ✔', 1);
                    dispatch(fetchData())
                } else {
                    showMessage('error', `could not delete file: ${filename}`, 1);
                }
            })
            .catch(err => {
                console.error(err.message);
                showMessage('error', `could not delete file: ${filename}`, 1);
            });
    };

    const handleFileUpload = async ({file, onSuccess, onError}) => {
        const filename = file.name;
        console.log('[filename] ', filename)
        const auditRegex = /.audit$/g
        const exec = auditRegex.exec(filename);
        if (exec !== null) {
            const fileExists = await checkUniqueDocument(filename);
            console.log('[checkUniqueDocument] response: ', fileExists);
            if (fileExists.exists) {
                showMessage('error', `the file ${filename} already exists`, 2)
                onError('error');
            } else {
                const form = new FormData();
                form.append('file', file, filename);
                form.append('fileName', filename);
                uploadAuditDocument(form)
                    .then(res => {
                        console.log('[uploadAuditDocument] response: ', res);
                        if (res.isSuccess) {
                            showMessage('success', 'uploaded successfully ✔', 1);
                            onSuccess('success');
                            dispatch(fetchData())
                        } else {
                            showMessage('error', 'server error on file upload', 1);
                            onError('error');
                        }
                    })
                    .catch(err => {
                        console.error(err.message);
                        showMessage('error', 'Error on upload', 1);
                    });
            }
        } else {
            showMessage('error', 'file is not of type .audit', 1);
        }
    };


    const handleFileDownload = async (filename) => {
        downloadAuditFile(filename)
            .then(file => {
                console.log('[downloadAuditFile] response: ', file)
                fileDownload(file, filename, '.audit');
            })
            .catch(err => {
                console.error(err.message);
                showMessage('error', 'could not download audit file', 1);
            })
    };

    const updateParsedItem = (item) => {
        dispatch(updateParseViewItem(item))
        dispatch(toggleIsParsedView(true))
    }
    return <>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
        }}>
            <Title
                style={{display: 'inline-block', color: '#645790'}}
                level={4}>
                <code>[{files.length}] audit files 👾</code>
            </Title>
            <Upload
                fileList={[]}
                // @ts-ignore
                customRequest={handleFileUpload}>
                <Button type={'default'}>Upload <FolderAddOutlined/></Button>
            </Upload>
            <Title
                style={{display: 'inline-block', color: '#645790'}}
                level={4}>
                <code>Pasecinic Nichita faf_192</code>
            </Title>
        </div>
        <List
            style={{overflow: 'hidden'}}
            loading={files_loading}
            size="small"
            header={<p style={{marginBottom: 0}}>Documents Archive:</p>}
            bordered
            dataSource={files}
            renderItem={(item) => <List.Item
                style={{display: 'flex'}}>
                <Popconfirm
                    icon={<FileUnknownOutlined/>}
                    title={'Actions'}
                    onConfirm={() => {
                        handleFileDownload(item.audit_file!.filename);
                    }}
                    onCancel={() => updateParsedItem(item)}
                    okText={<>Download <DownloadOutlined/></>}
                    cancelText={<>View <ArrowsAltOutlined/></>}
                >
                    <p
                        style={{
                            cursor: 'pointer',
                            width: '90%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginBottom: 0
                        }}>{item.audit_file!.filename}</p>
                </Popconfirm>

                <Popconfirm
                    icon={<InfoCircleOutlined/>}
                    placement={'topRight'}
                    title={'Delete file ? 👀'}
                    onConfirm={() => {
                        deleteFile(item.audit_file!.filename);
                    }}
                    onCancel={() => message.info(`😒`, 1)}
                    okText="Confirm"
                    cancelText="Cancel"
                >
                    <DeleteOutlined style={{color: 'red'}}/>
                </Popconfirm>
                <Popconfirm
                    icon={<FileSearchOutlined/>}
                    placement={'topRight'}
                    title={'Edit file ? 👀'}
                    onConfirm={() => {
                        dispatch(toggleIsEditView(true))
                        dispatch(updateEditViewItem(item))
                    }}
                    onCancel={() => {
                    }}
                    okText={'Edit'}
                    cancelText={'Cancel'}
                >
                    <EditOutlined style={{color: '#33A2FF'}}/>
                </Popconfirm>

            </List.Item>}
        />
    </>
}


