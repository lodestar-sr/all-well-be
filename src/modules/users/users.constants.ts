import { WEB_APP_HOST } from "../../shared/constants/message.constants";

export const EMAIL_VERIFY_URL = WEB_APP_HOST + `/auth/verify`;

// TODO: need to be confirmed for change password page - this is fake url
export const RESET_PASSWORD_URL = WEB_APP_HOST + `/auth/reset-password`;
