const sendResponse = (res, statusCode, success, message, data = null) => {
    const responsePayload = { success, message };
    if (data !== undefined && data !== null) {
        responsePayload.data = data;
    }
    return res.status(statusCode).json(responsePayload);
};

module.exports = { sendResponse };
