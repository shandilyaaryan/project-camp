interface ApiErrorInput {
  statuscode: number;
  message: string;
  errors?: string[];
  stack?: string;
}

class ApiError extends Error {
  statuscode: number;
  errors: string[];

  constructor({ statuscode, message, errors = [], stack }: ApiErrorInput) {
    super(message);
    this.statuscode = statuscode;
    this.errors = errors;

    // Use provided stack or generate new one
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace?.(this, ApiError);
    }

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export { ApiError };