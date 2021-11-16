import React, {useContext} from 'react';
import {Button, Col, List, Row, Tooltip, Typography, Upload} from 'antd';
import {
    CloudDownloadOutlined,
    DeleteOutlined,
    FolderAddOutlined,
    FolderViewOutlined,
    PartitionOutlined
} from '@ant-design/icons';
import {AppContext} from '../context/context';
import {
    fetchData,
    toggleIsEditView,
    toggleIsParsedView,
    updateEditViewItem,
    updateParseViewItem
} from '../context/reducer';
import {checkUniqueDocument, deleteAuditDocument, downloadAuditFile, uploadAuditDocument} from '../services/api';
import fileDownload from 'js-file-download';
import {showMessage} from '../utils';

const {Text} = Typography;

export const DocumentList = () => {

    const {state, dispatch} = useContext(AppContext);
    const {files, files_loading} = state;

    const deleteFile = async (filename) => {
        deleteAuditDocument(filename)
            .then(res => {
                console.log('[deleteAuditDocument] response: ', res);
                if (res.isSuccess) {
                    showMessage('success', 'deleted successfully ✔', 1);
                    dispatch(fetchData());
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
        console.log('[filename] ', filename);
        const auditRegex = /.audit$/g;
        const exec = auditRegex.exec(filename);
        if (exec !== null) {
            const fileExists = await checkUniqueDocument(filename);
            console.log('[checkUniqueDocument] response: ', fileExists);
            if (fileExists.exists) {
                showMessage('error', `the file ${filename} already exists`, 2);
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
                            dispatch(fetchData());
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
                console.log('[downloadAuditFile] response: ', file);
                fileDownload(file, filename, '.audit');
            })
            .catch(err => {
                console.error(err.message);
                showMessage('error', 'could not download audit file', 1);
            });
    };

    const updateParsedItem_ = (item) => {
        dispatch(updateParseViewItem(item));
        dispatch(toggleIsParsedView(true));
    };

    return <>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px'
        }}>
            <Text
                style={{display: 'inline-block', color: '#645790', fontSize: '17px', fontWeight: 'bold'}}>
                <code>audit documents [{files.length}]</code>
            </Text>
            <Upload
                fileList={[]}
                // @ts-ignore
                customRequest={handleFileUpload}>
                <Button type={'default'}>Upload <FolderAddOutlined/></Button>
            </Upload>

        </div>
        <List
            style={{overflow: 'hidden'}}
            loading={files_loading}
            size="small"
            header={<p style={{marginBottom: 0}}>Audits Archive:</p>}
            bordered
            dataSource={files}
            renderItem={(item) => <List.Item>
                <Row style={{width: '100%'}}>
                    <Col span={12}>
                        {item.audit_file!.filename}
                    </Col>
                    <Col span={12}>
                        <Row justify={'end'} gutter={[3, 0]}>
                            <Col>
                                <Tooltip title={'delete'} placement={'left'}>
                                    <Button
                                        danger={true}
                                        onClick={() => deleteFile(item.audit_file!.filename)}
                                        icon={<DeleteOutlined/>}/>
                                </Tooltip>
                            </Col>
                            <Col>
                                <Tooltip title={'view json'}>
                                    <Button onClick={() => updateParsedItem_(item)}
                                            icon={<PartitionOutlined/>}
                                    />
                                </Tooltip>
                            </Col>
                            <Col>
                                <Tooltip title={'download file'}>
                                    <Button icon={<CloudDownloadOutlined/>}
                                            onClick={() => handleFileDownload(item.audit_file!.filename)}/>
                                </Tooltip>
                            </Col>
                            <Col>
                                <Tooltip title={'details'}>
                                    <Button onClick={() => {
                                        dispatch(toggleIsEditView(true));
                                        dispatch(updateEditViewItem(item));
                                    }} icon={<FolderViewOutlined/>}/>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </List.Item>}
        />
    </>;
};


