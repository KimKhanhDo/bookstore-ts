import { useEffect, useState } from 'react';
import {
    App,
    Col,
    Divider,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Upload,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { v4 as uuidv4 } from 'uuid';

import { getCategoryAPI, updateBookAPI, uploadFileAPI } from '@/services/api';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/helper/dateRangeValidate';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = 'thumbnail' | 'slider';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IBookTable | null;
    setDataUpdate: (v: IBookTable | null) => void;
}

type FieldType = {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

const UpdateBook = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        dataUpdate,
        setDataUpdate,
    } = props;

    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState<
        { label: string; value: string }[]
    >([]);

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>(
        [],
    );
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.map((item) => ({
                    label: item,
                    value: item,
                }));
                setListCategory(d);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        if (dataUpdate) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`,
                },
            ];

            const arrSlider = dataUpdate?.slider?.map((item) => ({
                uid: uuidv4(),
                name: item,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
            }));

            form.setFieldsValue({
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                category: dataUpdate.category,
                quantity: dataUpdate.quantity,
                thumbnail: arrThumbnail,
                slider: arrSlider,
            });

            setFileListThumbnail(arrThumbnail as any);
            setFileListSlider(arrSlider as any);
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);

        const { _id, mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? '';
        const slider = fileListSlider?.map((item) => item.name) ?? [];

        const res = await updateBookAPI(
            _id,
            mainText,
            author,
            price,
            quantity,
            category,
            thumbnail,
            slider,
        );

        if (res && res.data) {
            message.success('Book updated successfully');
            form.resetFields();
            setFileListSlider([]);
            setFileListThumbnail([]);
            setDataUpdate(null);
            setOpenModalUpdate(false);
            refreshTable();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
            });
        }

        setIsSubmit(false);
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
        }

        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;

        if (!isLt2M) {
            message.error(
                `Image must be smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`,
            );
        }

        return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === 'thumbnail') {
            setFileListThumbnail([]);
        }

        if (type === 'slider') {
            const newSlider = fileListSlider.filter((x) => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    };

    const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
        if (info.file.status === 'uploading') {
            type === 'slider'
                ? setLoadingSlider(true)
                : setLoadingThumbnail(true);
            return;
        }

        if (info.file.status === 'done') {
            type === 'slider'
                ? setLoadingSlider(false)
                : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile = async (
        options: RcCustomRequestOptions,
        type: UserUploadType,
    ) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;

        const res = await uploadFileAPI(file, 'book');

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`,
            };

            if (type === 'thumbnail') {
                setFileListThumbnail([{ ...uploadedFile }]);
            } else {
                setFileListSlider((prevState) => [
                    ...prevState,
                    { ...uploadedFile },
                ]);
            }

            if (onSuccess) onSuccess('ok');
        } else {
            message.error(res.message);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    return (
        <>
            <Modal
                title="Update Book"
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    form.resetFields();
                    setFileListSlider([]);
                    setFileListThumbnail([]);
                    setDataUpdate(null);
                    setOpenModalUpdate(false);
                }}
                destroyOnClose
                okButtonProps={{ loading: isSubmit }}
                okText="Update"
                cancelText="Cancel"
                confirmLoading={isSubmit}
                width={'50vw'}
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-update-book"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Form.Item
                            name="_id"
                            hidden
                        >
                            <Input />
                        </Form.Item>

                        <Col span={12}>
                            <Form.Item
                                label="Book Title"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the book title!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Author"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the author!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the price!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    formatter={(value) =>
                                        `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ',',
                                        )
                                    }
                                    addonAfter="đ"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a category!',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Quantity"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the quantity!',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Thumbnail Image"
                                name="thumbnail"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please upload a thumbnail!',
                                    },
                                ]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    customRequest={(options) =>
                                        handleUploadFile(options, 'thumbnail')
                                    }
                                    beforeUpload={beforeUpload}
                                    onChange={(info) =>
                                        handleChange(info, 'thumbnail')
                                    }
                                    onPreview={handlePreview}
                                    onRemove={(file) =>
                                        handleRemove(file, 'thumbnail')
                                    }
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {loadingThumbnail ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Slider Images"
                                name="slider"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please upload slider images!',
                                    },
                                ]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    customRequest={(options) =>
                                        handleUploadFile(options, 'slider')
                                    }
                                    beforeUpload={beforeUpload}
                                    onChange={(info) =>
                                        handleChange(info, 'slider')
                                    }
                                    onPreview={handlePreview}
                                    onRemove={(file) =>
                                        handleRemove(file, 'slider')
                                    }
                                    fileList={fileListSlider}
                                >
                                    <div>
                                        {loadingSlider ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                                !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Modal>
        </>
    );
};

export default UpdateBook;
