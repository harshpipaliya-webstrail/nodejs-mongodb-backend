import httpStatus from 'http-status';

/**
 * Class representing an API Response.
 */
class APIResponse {
  /**
   * Creates an API Response.
   * @param {JSONObjects} Data - data of API response.
   * @param {string} message - Response message.
   * @param {number} status - Application status.
   * @param {JSONObjects} error - if status is partial.
   */
  constructor(data = null, message = '', status = 200, error = null, count = 0) {
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }

    if (status) {
      this.status = status;
    }

    if (error) {
      this.error = error;
    }

    if (count >= 0) {
      this.count = count;
    }
  }
}

export default APIResponse;
