import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { claimService } from "@/services/features/claim.service";
import { GetClaimResponse } from "@/interfaces/claim.interface";
import { useAppSelector } from "@/services/store/store";
import { renderActions } from "../ViewClaims/claimActions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  FileWordOutlined,
  CheckOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TagOutlined,
  CopyOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import ClaimActionDialog from "@/page/Common/Action/ClaimActionDialog";
import { SearchWithSelect } from "@/components/ui/search-with-select";
import { Button } from "@/components/ui/button";
import { Download as DownloadIcon } from "lucide-react";
import HelloUserName from "@/components/kokonutui/helloUserName";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { vnpService } from "@/services/features/vnp.service";
import axios from "axios";
import qs from "qs";
import ClaimDialog from "./ViewClaimDetail";

const ViewClaims: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Added to track URL changes
  const user = useAppSelector((state) => state.auth.user);
  const [claims, setClaims] = useState<GetClaimResponse[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const searchParams = new URLSearchParams(location.search);
  const viewMode = searchParams.get("viewMode") || "ClaimerMode";
  const [viewType, setViewType] = useState<"tile" | "table">("tile");

  // Validate viewMode with user check || Bug gom vl ~_~ 
  const validateViewMode = (viewMode: string): string => {
    if (!user) {
      // If no user (post-logout), redirect to login instead of looping
      navigate("/login", { replace: true });
      return "ClaimerMode"; // Default, though this won't be used after navigation
    }

    const validModes: Record<string, string[]> = {
      ClaimerMode: ["Staff", "Approver", "Finance", "Admin"],
      ApproverMode: ["Approver"],
      FinanceMode: ["Finance"],
      AdminMode: ["Admin"],
      StaffMode: ["Staff"],
    };

    if (!validModes[viewMode]?.includes(user.role)) {
      navigate("?viewMode=ClaimerMode", { replace: true });
      return "ClaimerMode";
    }

    return viewMode;
  };

  // Memoize validatedViewMode to prevent recalculation unless viewMode or user changes
  const validatedViewMode = useMemo(
    () => validateViewMode(viewMode),
    [viewMode, user]
  );

  const [pageSize, setPageSize] = useState<number>(
    validatedViewMode === "FinanceMode" ? 6 : 20
  );
  const [totalClaims, setTotalClaims] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);
  const [selectedClaims, setSelectedClaims] = useState<GetClaimResponse[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] =
    useState(false);
  const [isDownloadConfirmationOpen, setIsDownloadConfirmationOpen] =
    useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [currentClaimId, setCurrentClaimId] = useState("");
  const [filter, setFilter] = React.useState("all");

  // Debounce search text
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const fetchClaims = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const effectiveStatus = filter === "all" ? "" : filter;
      const response = await claimService.getClaims(
        effectiveStatus,
        pageNumber,
        pageSize,
        validatedViewMode,
        debouncedSearchText
      );
      if (response && Array.isArray(response.items)) {
        setClaims(response.items.flat());
        setTotalClaims(response.meta.total_items);
      } else {
        setError("No claims found");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || "An error occurred while fetching claims";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, pageNumber, pageSize, validatedViewMode, debouncedSearchText]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Redirect to login if no user (post-logout)
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const totalPages = Math.ceil(totalClaims / pageSize);
  const pageRange = 2;
  const startPage = Math.max(1, pageNumber - pageRange);
  const endPage = Math.min(totalPages, pageNumber + pageRange);

  const handleSelectAll = () => {
    if (!selectedAll) {
      setSelectedClaims([...selectedClaims, ...claims]);
      setSelectedPages(new Set([...selectedPages, pageNumber]));
    } else {
      setSelectedClaims(
        selectedClaims.filter((claim) => !claims.some((c) => c.id === claim.id))
      );
      const newSelectedPages = new Set(selectedPages);
      newSelectedPages.delete(pageNumber);
      setSelectedPages(newSelectedPages);
    }
    setSelectedAll(!selectedAll);
  };

  useEffect(() => {
    setSelectedAll(selectedPages.has(pageNumber));
  }, [pageNumber, selectedPages]);

  useEffect(() => {
    setSelectedAll(false);
    setSelectedPages(new Set());
  }, [filter, debouncedSearchText]);

  const handleActionClick = (
    action: string,
    claimId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setCurrentAction(action);
    setCurrentClaimId(claimId);
    setDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePaySelectedClaims = () => {
    if (selectedClaims.length === 0) {
      toast.error("Please select at least one claim to pay");
      return;
    }

    const approvedClaims = selectedClaims.filter(
      (claim) => claim.status === "Approved"
    );
    if (approvedClaims.length === 0) {
      toast.error("Only approved claims can be paid");
      return;
    }

    setIsPaymentConfirmationOpen(true);
  };

  const handleDownloadSelectedClaims = () => {
    if (selectedClaims.length === 0) {
      toast.error("Please select at least one claim to download");
      return;
    }
    setIsDownloadConfirmationOpen(true);
  };

  const handlePayment = () => {
    const claimIds = selectedClaims.map((claim) => claim.id);
    const financeId = user?.id || "";

    vnpService
      .createVnpPayment({ claimIds, financeId })
      .then((response) => {
        if (response && response.data && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
          setIsPaymentConfirmationOpen(false);
        } else {
          toast.error("Invalid payment URL received");
        }
      })
      .catch((error) => {
        toast.error("Payment failed: " + error.message);
      });
  };

  const handleDownload = async () => {
    try {
      const claimIds = selectedClaims.map((claim) => claim.id);
      const response = await axios.get(
        "https://claim-request-system.azurewebsites.net/api/v1/claims/download",
        {
          params: { ClaimIds: claimIds },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            accept: "text/plain",
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Template_Export_Claim.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${selectedClaims.length} claims`);
    } catch (error) {
      toast.error("Download failed: " + (error as Error).message);
      console.error("Download error:", error);
    } finally {
      setIsDownloadConfirmationOpen(false);
    }
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading claims...</p>
    </div>
  );

  const NotFoundState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <FileWordOutlined className="text-4xl text-gray-400 mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );

  type ClaimAction =
    | "cancel"
    | "approve"
    | "reject"
    | "return"
    | "paid"
    | "print"
    | "submit";

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "draft", label: "Draft" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
    { value: "paid", label: "Paid" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy");
        console.error("Failed to copy: ", err);
      });
  };

  const CopyableText = ({ text, label }: { text: string; label?: string }) => (
    <div className="group relative inline-block">
      {label && <span className="text-gray-500 mr-1">{label}:</span>}
      <span className="font-medium">{text}</span>
      <button
        onClick={() => copyToClipboard(text)}
        className="absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy to clipboard"
      >
        <CopyOutlined className="text-gray-400 hover:text-blue-500" />
      </button>
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <input
                type="checkbox"
                checked={selectedAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              #
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Project
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Claimer
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date Range
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Hours
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {claims.map((claim, index) => (
            <tr key={claim.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedClaims.some((c) => c.id === claim.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (e.target.checked) {
                      setSelectedClaims([...selectedClaims, claim]);
                    } else {
                      setSelectedClaims(
                        selectedClaims.filter((c) => c.id !== claim.id)
                      );
                    }
                    setSelectedAll(
                      selectedClaims.length + (e.target.checked ? 1 : -1) ===
                        claims.length
                    );
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium">{index + 1}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {claim.projectName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{claim.staffName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {claim.projectStartDate} - {claim.projectEndDate}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {claim.totalWorkingHours}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-blue-600">
                  {claim.amount}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    claim.status === "Approved"
                      ? "bg-green-100 text-[#00b894]"
                      : claim.status === "Pending"
                      ? "bg-yellow-100 text-[#f3b760]"
                      : claim.status === "Draft"
                      ? "bg-pink-100 text-pink-500"
                      : claim.status === "Rejected"
                      ? "bg-red-100 text-[#ff3636]"
                      : claim.status === "Cancelled"
                      ? "bg-gray-100 text-gray-500"
                      : claim.status === "Paid"
                      ? "bg-blue-100 text-blue-500"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {claim.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex space-x-2">
                  {renderActions({
                    claim,
                    userRole: user?.role,
                    userFullName: user?.fullName,
                    handleActionClick,
                  }) || <ClaimDialog claimId={claim.id} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen pl-12 bg-[#f5f7fb]">
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold m-0">
              <HelloUserName />
            </h1>
            <div className="flex gap-4 items-center">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType("tile")}
                  className={`px-3 py-1.5 rounded-md flex items-center ${
                    viewType === "tile"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <AppstoreOutlined className="mr-1" /> Tile
                </button>
                <button
                  onClick={() => setViewType("table")}
                  className={`px-3 py-1.5 rounded-md flex items-center ${
                    viewType === "table"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <UnorderedListOutlined className="mr-1" /> Table
                </button>
              </div>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                {selectedAll ? "Deselect All" : "Select All"}
              </Button>
              {selectedClaims.length > 0 && (
                <Button
                  onClick={handleDownloadSelectedClaims}
                  className="flex items-center gap-2 bg-purple-100 text-purple-600 hover:bg-purple-200"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download ({selectedClaims.length})
                </Button>
              )}
              {validatedViewMode === "FinanceMode" &&
                selectedClaims.length > 0 && (
                  <Button
                    onClick={() => handlePaySelectedClaims()}
                    className="flex items-center gap-2 bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    Pay Selected Claims ({selectedClaims.length})
                  </Button>
                )}
              <SearchWithSelect
                searchValue={searchText}
                onSearchChange={setSearchText}
                selectValue={filter}
                onSelectChange={setFilter}
                selectPlaceholder="Filter by"
                searchPlaceholder="Search... e.g. project name, claimer name"
                selectItems={filterOptions}
              />
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <NotFoundState message={error} />
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                {claims.length === 0 ? (
                  <NotFoundState message="No claims found matching your criteria" />
                ) : (
                  <>
                    {viewType === "tile" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {claims.map((claim, index) => (
                          <div
                            key={claim.id}
                            className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                            style={{ animationDelay: `${index * 0.075}s` }}
                          >
                            <div className="bg-white border rounded-xl shadow-sm hover:shadow-md p-5 h-full transform transition-transform duration-300 hover:scale-105">
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedClaims.some(
                                      (c) => c.id === claim.id
                                    )}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      if (e.target.checked) {
                                        setSelectedClaims([
                                          ...selectedClaims,
                                          claim,
                                        ]);
                                      } else {
                                        setSelectedClaims(
                                          selectedClaims.filter(
                                            (c) => c.id !== claim.id
                                          )
                                        );
                                      }
                                      setSelectedAll(
                                        selectedClaims.length +
                                          (e.target.checked ? 1 : -1) ===
                                          claims.length
                                      );
                                    }}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                                  />
                                  <span className="font-medium text-lg text-gray-700">
                                    #{index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <TagOutlined className="mr-1 text-gray-500" />
                                  <span
                                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                                      claim.status === "Approved"
                                        ? "bg-green-100 text-[#00b894]"
                                        : claim.status === "Pending"
                                        ? "bg-yellow-100 text-[#f3b760]"
                                        : claim.status === "Draft"
                                        ? "bg-pink-100 text-pink-500"
                                        : claim.status === "Rejected"
                                        ? "bg-red-100 text-[#ff3636]"
                                        : claim.status === "Cancelled"
                                        ? "bg-gray-100 text-gray-500"
                                        : claim.status === "Paid"
                                        ? "bg-blue-100 text-blue-500"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {claim.status}
                                  </span>
                                </div>
                              </div>

                              <div className="mb-5 group relative">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                  {claim.projectName}
                                </h3>
                                <button
                                  onClick={() =>
                                    copyToClipboard(claim.projectName)
                                  }
                                  className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Copy project name"
                                >
                                  <CopyOutlined className="text-gray-400 hover:text-blue-500" />
                                </button>
                                <div className="flex items-center text-sm text-gray-600">
                                  <UserOutlined className="mr-1 text-gray-500" />
                                  <CopyableText
                                    text={claim.staffName}
                                    label="Claimer"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div className="group relative">
                                  <div className="flex items-center">
                                    <CalendarOutlined className="mr-1 text-gray-500" />
                                    <p className="text-gray-500">Start Date</p>
                                  </div>
                                  <div className="pl-5">
                                    <CopyableText
                                      text={claim.projectStartDate}
                                    />
                                  </div>
                                </div>
                                <div className="group relative">
                                  <div className="flex items-center">
                                    <CalendarOutlined className="mr-1 text-gray-500" />
                                    <p className="text-gray-500">End Date</p>
                                  </div>
                                  <div className="pl-5">
                                    <CopyableText text={claim.projectEndDate} />
                                  </div>
                                </div>
                                <div className="group relative">
                                  <div className="flex items-center">
                                    <ClockCircleOutlined className="mr-1 text-gray-500" />
                                    <p className="text-gray-500">Total Hours</p>
                                  </div>
                                  <div className="pl-5">
                                    <CopyableText
                                      text={claim.totalWorkingHours.toString()}
                                    />
                                  </div>
                                </div>
                                <div className="group relative">
                                  <div className="flex items-center">
                                    <DollarOutlined className="mr-1 text-gray-500" />
                                    <p className="text-gray-500">Amount</p>
                                  </div>
                                  <div className="pl-5 flex items-center">
                                    <span className="font-medium text-blue-600">
                                      {claim.amount}
                                    </span>
                                    <button
                                      onClick={() =>
                                        copyToClipboard(claim.amount.toString())
                                      }
                                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Copy amount"
                                    >
                                      <CopyOutlined className="text-gray-400 hover:text-blue-500" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end border-t pt-3 mt-2">
                                {renderActions({
                                  claim,
                                  userRole: user?.role,
                                  userFullName: user?.fullName,
                                  handleActionClick,
                                }) || <ClaimDialog claimId={claim.id} />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <TableView />
                    )}

                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationPrevious
                          onClick={handlePreviousPage}
                          className={
                            pageNumber <= 1
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : ""
                          }
                          aria-disabled={pageNumber <= 1}
                        />
                        {Array.from(
                          { length: endPage - startPage + 1 },
                          (_, index) => (
                            <PaginationItem key={startPage + index}>
                              <PaginationLink
                                onClick={() =>
                                  handlePageChange(startPage + index)
                                }
                                isActive={pageNumber === startPage + index}
                              >
                                {startPage + index}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationNext
                          onClick={handleNextPage}
                          className={
                            pageNumber >= totalPages
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : ""
                          }
                          aria-disabled={pageNumber >= totalPages}
                        />
                      </PaginationContent>
                    </Pagination>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {user?.role === "Staff" && (
          <Link
            to="/create-claim"
            className="inline-block mt-8 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            Create New Claim
          </Link>
        )}
      </div>
      <ClaimActionDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        action={currentAction as ClaimAction}
        claimId={currentClaimId}
        onActionComplete={fetchClaims}
      />
      <Dialog
        open={isPaymentConfirmationOpen}
        onOpenChange={setIsPaymentConfirmationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to pay for the following claims?
              <div className="mt-4">
                {selectedClaims.map((claim) => (
                  <div key={claim.id} className="text-sm">
                    Claim ID: {claim.id} - Amount: {claim.amount}
                  </div>
                ))}
              </div>
              <div className="mt-4 font-semibold">
                Total Amount:{" "}
                {selectedClaims.reduce(
                  (sum, claim) => sum + Number(claim.amount),
                  0
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePayment}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDownloadConfirmationOpen}
        onOpenChange={setIsDownloadConfirmationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Download</DialogTitle>
            <DialogDescription>
              Are you sure you want to download the following{" "}
              {selectedClaims.length} claims?
              <div className="mt-4">
                {selectedClaims.slice(0, 5).map((claim) => (
                  <div key={claim.id} className="text-sm">
                    Claim ID: {claim.id}
                  </div>
                ))}
                {selectedClaims.length > 5 && (
                  <div className="text-sm">
                    ...and {selectedClaims.length - 5} more
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDownloadConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDownload}>Confirm Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewClaims;
