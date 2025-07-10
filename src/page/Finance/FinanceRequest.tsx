import React, { useEffect, useState } from 'react';
import { Table, Card, Input, Row, Col, Tag } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GetClaimResponse } from '@/interfaces/claim.interface';
import { toast } from 'react-toastify';
import { claimService } from '@/services/features/claim.service';
import { useAppSelector } from '@/services/store/store';
import { PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, Pagination } from '@/components/ui/pagination';

interface TableColumn {
  title: string;
  dataIndex: keyof GetClaimResponse;
  key: string;
  width?: number;
  filters?: { text: string; value: string }[];
  onFilter?: (value: string, record: GetClaimResponse) => boolean;
  sorter?: (a: GetClaimResponse, b: GetClaimResponse) => number;
  render?: (value: any, record: GetClaimResponse) => React.ReactNode;
}

const FinanceRequest: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [claims, setClaims] = useState<GetClaimResponse[]>([]);
  const [claimStatus, setClaimStatus] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');

  // Calculate status counts
  const statusCounts = {
    total: claims.length,
    approved: claims.filter(claim => claim.status === 'Approved').length,
    paid: claims.filter(claim => claim.status === 'Paid').length
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await claimService.getClaims(claimStatus, pageNumber, pageSize, "FinanceMode");
        console.log('API Response:', response);
        
        if (response && Array.isArray(response.items)) {
          setClaims(response.items);
          setTotalClaims(response.meta.total_items);
        }
      } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'An error occurred';
        toast.error(errorMessage);
        console.error(error);
      }
    };

    fetchClaims();
  }, [claimStatus, pageNumber, pageSize]);

  // Calculate the range of pages to display
  const totalPages = Math.ceil(totalClaims / pageSize);
  const pageRange = 2;
  const startPage = Math.max(1, pageNumber - pageRange);
  const endPage = Math.min(totalPages, pageNumber + pageRange);

  const columns: TableColumn[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Project Name',
      dataIndex: 'project?.name',
      key: 'projectName',
      filters: claims
        .map(claim => claim.project?.name)
        .filter((name): name is string => name !== undefined)
        .map(name => ({ text: name, value: name })),
      onFilter: (value, record) => record.project?.name === value,
      sorter: (a, b) => (a.project?.name || '').localeCompare(b.project?.name || '')
    },
    {
      title: 'Created At',
      dataIndex: 'createAt',
      key: 'createAt',  
      sorter: (a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
    },
    {
      title: 'Total Working Hours',
      dataIndex: 'totalWorkingHours',
      key: 'totalWorkingHours',
      sorter: (a, b) => a.totalWorkingHours - b.totalWorkingHours
    },
    {
      title: 'Total Claim Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = '#f3b760';
        if (status === 'Approved') color = '#87d068';
        if (status === 'Paid') color = '#ff7675';
        return (
          <Tag color={color} className="border-none px-3 py-1 rounded-md w-[77px] text-center">
            {status}
          </Tag>
        );
      }
    }
  ];

  const paginatedData = claims.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  const handleStatusFilter = (status: string | null) => {
    setClaimStatus(status || '');
    setPageNumber(1);
  };

  return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="m-0 text-2xl font-semibold">Hello, {user?.name || 'User'}!</h1>
          <Input
            type="search"
            placeholder="Search"
            className="w-full sm:w-[200px]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
  
        <Row gutter={24} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card 
              onClick={() => handleStatusFilter(null)}
              className="bg-white rounded-xl shadow cursor-pointer" 
              bordered={false}
            >
              <div className="flex items-center gap-4 p-1">
                <div className="w-[65px] h-[65px] rounded-full flex items-center justify-center bg-[#e6f7f1] text-[#00b894]">
                  <UserOutlined className="text-[35px]" />
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[#666] text-xs">Total Request</span>
                  <span className="text-[30px] font-bold text-[#333]">{statusCounts.total}</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              onClick={() => handleStatusFilter('Approved')}
              className="bg-white rounded-xl shadow cursor-pointer" 
              bordered={false}
            >
              <div className="flex items-center gap-4 p-1">
                <div className="w-[65px] h-[65px] rounded-full flex items-center justify-center bg-[#e6f7f1] text-[#00b894]">
                  <CheckCircleOutlined className="text-[35px]" />
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[#666] text-xs">Approved</span>
                  <span className="text-[30px] font-bold text-[#333]">{statusCounts.approved}</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card 
              onClick={() => handleStatusFilter('Paid')}
              className="bg-white rounded-xl shadow cursor-pointer" 
              bordered={false}
          >
            <div className="flex items-center gap-4 p-1">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <CheckCircleOutlined className="text-3xl text-blue-500" />
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-gray-500 text-sm">Paid</span>
                  <span className="text-3xl font-bold text-gray-800">{statusCounts.paid}</span>
                </div>
              </div>
            </Card>
          </Col>
      </Row>
      
      <div className="bg-white p-6 rounded-lg overflow-x-auto">
      <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          onRow={(record) => ({
            onClick: () => navigate(`/detail/${record.id}`, { state: record }),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 'max-content' }}
          className="custom-antd-table"
        />
          
        <div className="mt-4">
        <Pagination className="mt-4">
              <PaginationContent>
                <PaginationPrevious 
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  className={pageNumber <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
                />
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                  <PaginationItem key={startPage + index}>
                    <PaginationLink
                      onClick={() => setPageNumber(startPage + index)}
                      isActive={pageNumber === startPage + index}
                    >
                      {startPage + index}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext 
                  onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                  className={pageNumber >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </PaginationContent>
            </Pagination>
        </div>
      </div>
    </div>
  );  
};

export default FinanceRequest; 