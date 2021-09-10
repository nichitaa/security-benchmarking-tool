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
    ArrowsAltOutlined, DeleteOutlined,
    DownloadOutlined,
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
                                 handleFileUpload
                             }) =>
    <>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
        }}>
            <Title
                style={{display: 'inline-block'}}
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
                style={{display: 'inline-block'}}
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

            </List.Item>}
        />
    </>

