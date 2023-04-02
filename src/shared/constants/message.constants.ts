import * as process from "process";

export const SUCCESS = 'SUCCESS';
export const ERROR = 'ERROR';
export const RECEIVE_MESSAGE = 'You will receive a message';
export const FAILED_CHANGE_PASSWORD = 'Failed to change password';
export const USER_NOT_EXIST = "User doesn't exist";
export const INVALID_TOKEN = 'Invalid Token';
export const WEB_APP_HOST = process.env.WEB_APP_HOST || 'http://localhost:8080';
