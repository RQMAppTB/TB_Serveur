/**
 * Function to create a json object with a message.
 * The message will be of the form {message: message}
 * @param {*} message The message to be included in the json object
 * @returns The json object with the message
 */
exports.jsonStrMessage = (message) => {
   return {message: message};
}