import React from 'react';
import Modal from 'antd/es/modal';
import { staffService } from '@/services/features/staff.service';
import { toast } from 'react-toastify';

interface DeleteStaffProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
  onSuccess: () => void;
}

const DeleteStaff: React.FC<DeleteStaffProps> = ({
  isOpen,
  onClose,
  staffId,
  staffName,
  onSuccess
}) => {
  const handleDelete = async () => {
    try {
      const response = await staffService.deleteStaff(staffId);
      if (response) {
        console.log("Delete success")
        toast.success("Staff deleted successfully");
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to delete staff');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <Modal
      title="Delete Staff"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="cancel"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>,
        <button
          key="delete"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
          onClick={handleDelete}
        >
          Delete
        </button>
      ]}
    >
      <p>Are you sure you want to delete staff member "{staffName}"?</p>
      <p>This action cannot be undone.</p>
    </Modal>
  );
};

export default DeleteStaff; 