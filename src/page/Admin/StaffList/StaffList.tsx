import React, { useState, useEffect } from "react";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Select from "antd/es/select";
import InputNumber from "antd/es/input-number";
import Switch from "antd/es/switch";
import Modal from "antd/es/modal";
import message from "antd/es/message";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  MailOutlined,
  BankOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { staffService } from "@/services/features/staff.service";
import {
  GetStaffResponse,
  SystemRole,
  CreateStaffRequest,
  Department,
} from "@/interfaces/staff.interface";
import UpdateStaff from "@/page/Staff/StaffActions/UpdateStaff";
import DeleteStaff from "@/page/Staff/StaffActions/DeleteStaff";
import { Upload, Button, Card, Avatar, Row, Col, Pagination, Badge } from "antd";
import type {
  UploadFile,
  UploadProps,
  RcFile,
  UploadChangeParam,
} from "antd/es/upload/interface";

interface StaffMember {
  key: string;
  name: string;
  rank: string;
  department: string;
  email: string;
  salary: string;
  avatar?: string;
}

const { Option } = Select;
const { Password } = Input;

interface UploadInfo {
  file: UploadFile;
  fileList: UploadFile[];
}

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<GetStaffResponse | null>(
    null
  );
  const [form] = Form.useForm<CreateStaffRequest>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  const fetchStaffList = async () => {
    setLoading(true);
    try {
      const response = await staffService.getStaffs();
      if (response?.data) {
        const mappedData = response.data.map((staff: GetStaffResponse) => ({
          key: staff.id,
          name: staff.responseName,
          rank: staff.systemRole,
          department: staff.department,
          email: staff.email,
          salary: staff.salary.toLocaleString("en-US"),
          avatar: staff.avatar,
        }));
        setStaffList(mappedData);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      message.error("Failed to fetch staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  const handleCreateStaff = async (values: CreateStaffRequest) => {
    try {
      const response = await staffService.createStaff(values);
      if (response.data) {
        message.success("Staff member created successfully");
        setIsModalOpen(false);
        form.resetFields();
        fetchStaffList();
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      message.error("Failed to create staff");
    }
  };

  const handleEdit = async (record: StaffMember) => {
    try {
      const response = await staffService.getStaffById(record.key);
      if (response.data) {
        console.log("Run from this to show");
        setSelectedStaff(response.data);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
      message.error("Failed to fetch staff details");
    }
  };

  const handleDelete = (record: StaffMember) => {
    setSelectedStaff({
      id: record.key,
      responseName: record.name,
    } as GetStaffResponse);

    setIsDeleteModalOpen(true);
  };

  const handleAvatarChange: UploadProps["onChange"] = (
    info: UploadChangeParam
  ) => {
    if (info.file.status === "done") {
      console.log("File uploaded successfully");
      form.setFieldsValue({ avatar: info.file.originFileObj });
    } else if (info.file.status === "error") {
      console.log("File upload failed");
    }
  };

  useEffect(() => {
    if (selectedStaff) {
      form.setFieldsValue({
        name: selectedStaff.responseName,
        email: selectedStaff.email,
        systemRole: selectedStaff.systemRole,
        department: selectedStaff.department,
        salary: selectedStaff.salary,
        isActive: selectedStaff.isActive,
        avatar: selectedStaff.avatar
          ? new File([selectedStaff.avatar], "avatar.png")
          : null,
      });
    }
  }, [selectedStaff, form]);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return staffList.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case SystemRole.Admin:
        return "red";
      case SystemRole.Finance:
        return "gold";
      case SystemRole.Approver:
        return "blue";
      case SystemRole.Staff:
        return "green";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen pl-10 bg-[#f5f7fb]">
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusOutlined />
            Add Staff
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {getCurrentPageData().map((staff, index) => (
                <Col 
                  xs={24} 
                  sm={12} 
                  md={8} 
                  lg={6} 
                  key={staff.key}
                  className={`opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards] transition-all duration-300`}
                  style={{ animationDelay: `${index * 0.075}s` }}
                >
                  <Card
                    hoverable
                    className="shadow-md h-full transform transition-transform duration-300 hover:scale-105"
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEdit(staff)}
                      />,
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDelete(staff)}
                        className="text-red-500"
                      />,
                    ]}
                  >
                    <div className="flex flex-col items-center mb-4">
                      <Avatar
                        size={80}
                        src={staff.avatar}
                        icon={<UserOutlined />}
                        className="mb-2"
                      />
                      <h3 className="text-lg font-semibold mb-1">
                        {staff.name}
                      </h3>
                      <Badge color={getRoleBadgeColor(staff.rank)} text={staff.rank} />
                    </div>

                    <div className="staff-card-details">
                      <div className="flex items-center mb-2">
                        <BankOutlined className="mr-2 text-gray-500" />
                        <span className="text-sm">{staff.department}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <MailOutlined className="mr-2 text-gray-500" />
                        <span className="text-sm overflow-hidden text-ellipsis">
                          {staff.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarOutlined className="mr-2 text-gray-500" />
                        <span className="text-sm">{staff.salary} VND</span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={staffList.length}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["4", "8", "12", "16"]}
              />
            </div>
          </>
        )}

        <Modal
          title="Add New Staff"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateStaff}
            initialValues={{ isActive: true }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input staff name!" }]}
            >
              <Input id="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input id="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input password!" }]}
            >
              <Password id="password" />
            </Form.Item>

            <Form.Item
              label="System Role"
              name="systemRole"
              rules={[{ required: true, message: "Please select a role!" }]}
            >
              <Select id="systemRole">
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
              rules={[{ required: true, message: "Please input department!" }]}
            >
              <Select id="department">
                {Object.values(Department).map((role) => (
                  <Option key={role} value={role}>
                    {role}
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
                id="salary"
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
              <Switch id="isActive" />
            </Form.Item>

            <Form.Item label="Avatar" name="avatar">
              <Upload
                accept="image/*"
                maxCount={1}
                listType="picture"
                showUploadList={true}
                beforeUpload={(file: RcFile) => {
                  form.setFieldsValue({ avatar: file });
                  return false;
                }}
                onChange={handleAvatarChange}
              >
                <Button>
                  <UploadOutlined /> Upload Avatar
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  type="submit"
                >
                  Create
                </button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <UpdateStaff
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          staffData={selectedStaff}
          onSuccess={fetchStaffList}
        />

        <DeleteStaff
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          staffId={selectedStaff?.id || ""}
          staffName={selectedStaff?.responseName || ""}
          onSuccess={fetchStaffList}
        />
      </div>
    </div>
  );
};

export default StaffList;
