import { apiService } from "./apiService";
import { wrapResponse } from "./ApiServiceConfig";
import type { ShopItemDto } from "@/model/admin/adminTypes";

export interface BuyItemRequest {
  quantity?: number;
}

export interface CreateOrderDto {
  items: Array<{
    itemId: string;
    quantity: number;
  }>;
}

export interface ShopOrderDto {
  id: string;
  userId: string;
  items: Array<{
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export const shopApiService = {
  // ============ SHOP ITEMS APIs ============
  /** Get all shop items (public endpoint) */
  getShopItems: async (activeOnly: boolean = true): Promise<ShopItemDto[]> => {
    try {
      const response = await apiService.privateApiClient.get<ShopItemDto[]>(
        `/Shop/items?activeOnly=${activeOnly}`
      );
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error fetching shop items:", error);
      throw error;
    }
  },

  /** Get shop item by ID */
  getShopItemById: async (id: string): Promise<ShopItemDto> => {
    try {
      const response = await apiService.privateApiClient.get<ShopItemDto>(
        `/Shop/items/${id}`
      );
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error fetching shop item by ID:", error);
      throw error;
    }
  },

  /** Buy a shop item */
  buyItem: async (id: string, request: BuyItemRequest): Promise<ShopOrderDto> => {
    try {
      const response = await apiService.privateApiClient.post<ShopOrderDto>(
        `/Shop/items/${id}/buy`,
        request
      );
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error buying item:", error);
      throw error;
    }
  },

  // ============ ORDERS APIs ============
  /** Get all orders for current user */
  getOrders: async (): Promise<ShopOrderDto[]> => {
    try {
      const response = await apiService.privateApiClient.get<ShopOrderDto[]>(
        `/Shop/orders`
      );
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error fetching orders:", error);
      throw error;
    }
  },

  /** Get order by ID */
  getOrderById: async (id: string): Promise<ShopOrderDto> => {
    try {
      const response = await apiService.privateApiClient.get<ShopOrderDto>(
        `/Shop/orders/${id}`
      );
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error fetching order by ID:", error);
      throw error;
    }
  },

  /** Create an order */
  createOrder: async (order: CreateOrderDto): Promise<ShopOrderDto> => {
    try {
      const response = await apiService.privateApiClient.post<ShopOrderDto>(
        `/Shop/orders`,
        order
      );
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error creating order:", error);
      throw error;
    }
  },
};


