export interface CustomResponse<T = any> {
  payload?: CustomResponsePayload<T>;
  message: string;
  statusCode: number;
}

export interface CustomResponsePayload<T = any> {
  data: T;
  page?: number;
  pages?: number;
  limit?: number;
  total?: number;
}
