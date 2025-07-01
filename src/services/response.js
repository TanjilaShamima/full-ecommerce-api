const successResponse = (
  res,
  {
    statusCode = 200,
    message = "Request was successful",
    payload = {},
    meta = null,
  }
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode: statusCode,
    message: message,
    result: payload,
    meta: meta,
  });
};

const errorResponse = (res, error) => {
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
