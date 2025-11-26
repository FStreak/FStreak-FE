import apiService from "./apiService";

export interface CreatePaymentDto {
  planId: string;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResponseDto {
  paymentUrl: string;
  orderCode: string;
  status: string;
}

export interface PaymentStatusDto {
  orderCode: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  completedAt?: string;
}

const paymentService = {
  // Tạo link thanh toán PayOS
  createPayment: async (data: CreatePaymentDto): Promise<PaymentResponseDto> => {
    try {
      // ✅ Rút ngắn description xuống 25 ký tự
      const shortDescription = data.description.length > 25 
        ? data.description.substring(0, 25) 
        : data.description;

      const requestData = {
        ...data,
        description: shortDescription
      };

      console.log('🔵 Đang tạo thanh toán:', requestData);

      const response = await apiService.privateApiClient.post<PaymentResponseDto>(
        "/PayOS/create-payment",
        requestData
      );

      console.log('✅ Tạo thanh toán thành công:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Lỗi tạo thanh toán:", error);
      throw error;
    }
  },

  // Kiểm tra trạng thái thanh toán
  getPaymentStatus: async (orderCode: string): Promise<PaymentStatusDto> => {
    try {
      const response = await apiService.privateApiClient.get<PaymentStatusDto>(
        `/PayOS/status/${orderCode}`
      );
      return response.data;
    } catch (error: any) {
      console.error("❌ Lỗi kiểm tra trạng thái thanh toán:", error);
      throw error;
    }
  },
};

export default paymentService;
