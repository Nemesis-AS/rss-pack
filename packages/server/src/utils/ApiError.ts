export default class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details: object | null = null,
  ) {
    super(message);

    this.name = "ApiError";
  }

  static BadRequest(message: string) {
    return new ApiError(400, message);
  }

  static NotFound(resource: string) {
    return new ApiError(404, `${resource} not found`);
  }

  static InternalServerError(message: string) {
    return new ApiError(500, message);
  }
}
