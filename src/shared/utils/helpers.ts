import {
  OPERATOR_BIGGER,
  OPERATOR_BIGGER_OR_EQUAL,
  OPERATOR_EQUAL,
  OPERATOR_IN,
  OPERATOR_INSENSITIVE_LIKE,
  OPERATOR_IS,
  OPERATOR_LIKE,
  OPERATOR_LITTLE,
  OPERATOR_LITTLE_OR_EQUAL,
  OPERATOR_NOT_EQUAL,
  OPERATOR_NOT_IN,
} from '../constants/global.constants';
import { EntitySchema, getConnection, ObjectType } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { WhereDto } from '../dtos/where.dto';

export const prepareWhere = (
  field: string,
  value: string | number | number[],
  operator = OPERATOR_EQUAL,
  alias = '',
): WhereDto => {
  const result = {
    whereCondition: '',
    whereParams: {},
  };

  switch (operator) {
    case OPERATOR_LITTLE:
    case OPERATOR_LITTLE_OR_EQUAL:
    case OPERATOR_BIGGER:
    case OPERATOR_BIGGER_OR_EQUAL:
    case OPERATOR_EQUAL:
    case OPERATOR_NOT_EQUAL:
    case OPERATOR_IS:
    case OPERATOR_LIKE:
    case OPERATOR_INSENSITIVE_LIKE:
      result.whereCondition = `${
        alias ? alias + '.' : ''
      }${field} ${operator} :${field}`;
      result.whereParams[`${field}`] = value;
      break;

    case OPERATOR_IN:
    case OPERATOR_NOT_IN:
      if (value && Array.isArray(value)) {
        let condition = '';

        value.forEach((val, index) => {
          condition += `:${field}${index + 1}`;
          result.whereParams[`${field}${index + 1}`] = val;

          if (index < value.length - 1) {
            condition += ', ';
          }
        });

        result.whereCondition = `${
          alias ? alias + '.' : ''
        }${field} ${operator} (${condition})`;
      }
      break;
    default:
      result.whereCondition = `${alias ? alias + '.' : ''}${field} = ${
        !Array.isArray(value) ? value : ''
      }`;
      break;
  }

  return result;
};

export const caseInsensitiveCount = async <T>(
  fieldName: string,
  fieldValue: string,
  entity: ObjectType<T> | EntitySchema<T> | string,
): Promise<number> => {
  const where = prepareWhere(
    snakeCase(fieldName),
    `${fieldValue}`,
    OPERATOR_EQUAL,
  );

  return await getConnection()
    .getRepository(entity)
    .createQueryBuilder()
    .where(where.whereCondition, where.whereParams)
    .getCount();
};
