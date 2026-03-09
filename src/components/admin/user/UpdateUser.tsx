import { useEffect, useState } from 'react';
import { App, Divider, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';
import { updateUserAPI } from '@/services/api';

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
}

type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
};

const UpdateUser = (props: IProps) => {
    const {
        openModalUpdate,
        setOpenModalUpdate,
        refreshTable,
        setDataUpdate,
        dataUpdate,
    } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
            });
        }
    }, [dataUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, fullName, phone } = values;
        setIsSubmit(true);

        const res = await updateUserAPI(_id, fullName, phone);

        if (res && res.data) {
            message.success('User updated successfully');
            form.resetFields();
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
            });
        }

        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Update User"
                open={openModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText={'Update'}
                cancelText={'Cancel'}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-update"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        hidden
                        labelCol={{ span: 24 }}
                        label="_id"
                        name="_id"
                        rules={[
                            { required: true, message: 'Please enter _id!' },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email!' },
                            {
                                type: 'email',
                                message: 'Invalid email format!',
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Display Name"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the display name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Phone Number"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the phone number!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateUser;
