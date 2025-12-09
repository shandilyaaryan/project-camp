interface ApiResponseInput<T> {
  statuscode: number;
  data: T;
  message?: string;
}

class ApiResponse<T> implements ApiResponseInput<T> {
  statuscode: number;
  data: T;
  message: string;
  success: boolean;
  constructor(statuscode: number, data: T, message: string = "Success") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400;
  }
}

export { ApiResponse };
