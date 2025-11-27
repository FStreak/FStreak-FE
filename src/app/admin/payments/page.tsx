"use client";

import { useEffect, useState } from "react";
import { PaymentHistoryDto } from "@/model/payment/PaymentHistoryModel";
import paymentService from "@/services/paymentService";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentHistoryDto[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    paid: 0,
    pending: 0,
    cancelled: 0,
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAllPayments();
      setPayments(data);
      setFilteredPayments(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = payments;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.orderCode.toString().includes(searchTerm) ||
          p.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments]);

  const calculateStats = (data: PaymentHistoryDto[]) => {
    const total = data.length;
    const totalAmount = data
      .filter((p) => p.status.toLowerCase() === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const paid = data.filter((p) => p.status.toLowerCase() === "paid").length;
    const pending = data.filter((p) => p.status.toLowerCase() === "pending").length;
    const cancelled = data.filter((p) => p.status.toLowerCase() === "cancelled").length;

    setStats({ total, totalAmount, paid, pending, cancelled });
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === "paid") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    } else if (statusLower === "pending") {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Quản lý Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi và quản lý tất cả giao dịch thanh toán
          </p>
        </div>
        <Button onClick={fetchPayments} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tổng giao dịch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Đã thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Đang chờ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Đã hủy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên user, order code, user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">Tất cả</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Code</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  {/* <TableHead>Ngày hoàn thành</TableHead> */}
                  {/* <TableHead>Transaction Ref</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Không có giao dịch nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono font-medium">
                        {payment.orderCode}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.userName}</div>
                          <div className="text-xs text-gray-500">{payment.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.planId}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      {/* <TableCell>
                        {payment.completeAt
                          ? format(new Date(payment.completeAt), "dd/MM/yyyy HH:mm")
                          : "-"}
                      </TableCell> */}
                      {/* <TableCell className="font-mono text-xs">
                        {payment.transactionReference || "-"}
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Hiển thị {filteredPayments.length} / {payments.length} giao dịch
      </div>
    </div>
  );
}
