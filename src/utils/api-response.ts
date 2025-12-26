interface ApiResponseInput<T> {
  statusCode: number;
  data?: T;
  message?: string;
}

export class ApiResponse<T> implements ApiResponseInput<T> {
  statusCode: number;
  data?: T;
  message?: string;
  success: boolean;
  constructor({ statusCode, data, message = "Success" }: ApiResponseInput<T>) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
