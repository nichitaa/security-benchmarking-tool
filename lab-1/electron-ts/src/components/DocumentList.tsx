import React from "react";
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
import {AuditDocument} from "../App";

const {Title} = Typography;

export const DocumentList = ({
                                 files,
                                 loading,
                                 handleFileDownload,
                                 updateParsedViewItem,
                                 deleteFile,
                                 handleFileUpload,
                                 toggleIsEditView,
                                 updateEditViewItem
                             }) =>
    <>
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
            {/*<Button onClick={() => toggleIsCreateView(true)}>Create <FileAddOutlined/></Button>*/}
            <Title
                style={{display: 'inline-block', color: '#645790'}}
                level={4}>
                <code>Pasecinic Nichita faf_192</code>
            </Title>
        </div>
        <List
            style={{overflow: 'hidden'}}
            loading={loading}
            size="small"
            header={<p style={{marginBottom: 0}}>Documents Archive:</p>}
            bordered
            dataSource={files}
            renderItem={(item: AuditDocument) => <List.Item
                style={{display: 'flex'}}>
                <Popconfirm
                    icon={<FileUnknownOutlined/>}
                    title={'Actions'}
                    onConfirm={() => {
                        handleFileDownload(item.audit_file!.filename);
                    }}
                    onCancel={() => updateParsedViewItem(item)}
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
                        toggleIsEditView(true);
                        updateEditViewItem(item);
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

