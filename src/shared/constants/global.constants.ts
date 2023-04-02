import { Column } from 'exceljs';
import { WEB_APP_HOST } from './message.constants';

export enum TokenType {
  DEFAULT = 'default',
  EMAIL_VERIFICATION = 'email_verification',
  CHANGE_PASSWORD = 'change_password',
  RESET_PASSWORD = 'reset_password',
}

export const RESET_PASSWORD_URL = WEB_APP_HOST + `/auth/reset-password`;

export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 1000;

export type BasicColumn = Pick<Column, 'header' | 'key' | 'width'>;

// SQL Query Operators
export const OPERATOR_EQUAL = '=';
export const OPERATOR_NOT_EQUAL = '!=';
export const OPERATOR_IS = 'IS';
export const OPERATOR_IN = 'IN';
export const OPERATOR_NOT_IN = 'NOT IN';
export const OPERATOR_LIKE = 'LIKE';
export const OPERATOR_INSENSITIVE_LIKE = 'ILIKE';
export const OPERATOR_BIGGER = '>';
export const OPERATOR_LITTLE = '<';
export const OPERATOR_BIGGER_OR_EQUAL = '>=';
export const OPERATOR_LITTLE_OR_EQUAL = '<=';
export const OPERATOR_CONTAINS = '@>';
export const OPERATOR_OVERLAPS = '&&';
