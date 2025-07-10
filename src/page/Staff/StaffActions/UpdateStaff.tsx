import React, { useEffect } from "react";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Select from "antd/es/select";
import InputNumber from "antd/es/input-number";
import Switch from "antd/es/switch";
import Modal from "antd/es/modal";
import message from "antd/es/message";
import { staffService } from "@/services/features/staff.service";
import {
  GetStaffResponse,
  SystemRole,
  UpdateStaffRequest,
  Department,
} from "@/interfaces/staff.interface";
import { toast } from "react-toastify";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { RcFile } from "antd/es/upload";
import { UploadProps } from "antd/es/upload";

interface UpdateStaffProps {
  isOpen: boolean;
  onClose: () => void;
  staffData: GetStaffResponse | null;
  onSuccess: () => void;
}

const { Option } = Select;
const { Password } = Input;

const UpdateStaff: React.FC<UpdateStaffProps> = ({
  isOpen,
  onClose,
  staffData,
  onSuccess,
}) => {
  const [form] = Form.useForm<UpdateStaffRequest>();

  useEffect(() => {
    if (staffData) {
      form.setFieldsValue({
        id: staffData.id,
        name: staffData.responseName,
        email: staffData.email,
        systemRole: staffData.systemRole,
        department: staffData.department,
        salary: staffData.salary,
        isActive: staffData.isActive,
      });
    }
  }, [staffData, form]);

  const handleUpdate = async (values: UpdateStaffRequest) => {
    if (!staffData) return;

    try {
      const updateData: UpdateStaffRequest = {
        ...values,
        avatar: values.avatar || null,
      };
      const response = await staffService.updateStaff(staffData.id, updateData);
      console.log("Update response:", response);
      if (response.data) {
        toast.success("Update successfully");
        form.resetFields();
        onSuccess();
        onClose();
      } else {
        message.error(response.message || "Failed to update staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred");
      }
    }
  };

  const handleAvatarChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      form.setFieldsValue({ avatar: file });
    } else {
      form.setFieldsValue({ avatar: null });
    }
  };

  return (
    <Modal title="Edit Staff" open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input staff name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Password placeholder="Leave blank to keep current password" />
        </Form.Item>

        <Form.Item
          label="System Role"
          name="systemRole"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select>
            {Object.values(SystemRole).map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: "Please select department!" }]}
        >
          <Select>
            {Object.values(Department).map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: "Please input salary!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Active Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item label="Avatar" name="avatar">
          <Upload
            accept="image/*"
            maxCount={1}
            listType="picture"
            showUploadList={true}
            beforeUpload={() => false} // Prevents auto upload
            onChange={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />}>Upload New Avatar</Button>
          </Upload>
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              type="submit"
            >
              Update
            </button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateStaff;
