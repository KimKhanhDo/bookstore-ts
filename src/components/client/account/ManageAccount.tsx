import { Modal, Tabs } from 'antd';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { isModalOpen, setIsModalOpen } = props;

    const items = [
        {
            key: 'info',
            label: `Update Information`,
            children: <UserInfo />,
        },
        {
            key: 'password',
            label: `Change Password`,
            children: <ChangePassword />,
        },
    ];

    return (
        <Modal
            title="Account Management"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={false}
            width={'60vw'}
        >
            <Tabs
                defaultActiveKey="info"
                items={items}
            />
        </Modal>
    );
};

export default ManageAccount;
