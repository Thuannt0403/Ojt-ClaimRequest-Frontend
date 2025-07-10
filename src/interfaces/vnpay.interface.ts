export interface createVnpPaymentRequest {
  claimId: string;
  financeId: string;
}

export interface createVnpPaymentResponse {
  paymentUrl: string;
}
