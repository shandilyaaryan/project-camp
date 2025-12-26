interface ApiErrorInput {
  statusCode: number;
  message: string;
  errors?: string[] | Object[];
  stack?: string;
}

export class ApiError extends Error {
  statusCode: number;
  errors: string[] | Object[];

  constructor({ statusCode, message, errors = [], stack }: ApiErrorInput) {
    super(message);
    this.statusCode = statusCode;
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
