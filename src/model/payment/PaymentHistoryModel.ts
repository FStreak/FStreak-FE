export interface PaymentHistoryDto {
  id: number;
  userId: string;
  userName: string;
  orderCode: number;
  amount: number;
  planId: string;
  status: string;
  createdAt: string;
  completeAt?: string;
  transactionReference?: string;
}

export interface PaymentFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}
