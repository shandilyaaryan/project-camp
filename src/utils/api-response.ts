interface ApiResponseType<T> {
  statuscode: number;
  data: T;
  message?: string;
}

class ApiResponse<T> implements ApiResponseType<T> {
  statuscode: number;
  data: T;
  message?: string;
  success: boolean;
  constructor({ statuscode, data, message = "Success" }: ApiResponseType<T>) {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400;
  }
}

export { ApiResponse };
