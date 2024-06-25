export type TCouponInputDTO = {
  code: string;
  discount: number;
  event_id: string;
};

export type TCouponOutputDTO = {
  id: string;
  code: string;
  discount: number;
  valid: boolean;
  event_id: string;
};
