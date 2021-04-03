import * as clt from 'class-transformer';
import * as clv from 'class-validator';
import * as ncm from '@nestjs/common';

export class ValidationError<T> extends Error {
  private readonly validationErrors: Array<clv.ValidationError>;
  private readonly value: Array<T> | T;

  private constructor(message: string, validationErrors: Array<clv.ValidationError>, value: Array<T> | T) {
    super(message);
    this.validationErrors = validationErrors;
    this.value = value;
  }

  get data() {
    const errors = publish(this.validationErrors);
    const value = this.value;
    return {errors, value};
  }

  static async validateAsync<T>(cls: Array<ncm.Type<T>> | ncm.Type<T>, value: Array<T> | T) {
    const validationErrors = Array.isArray(cls)
      ? await validateArrayAsync(cls, value)
      : await validateSingleAsync(cls, value);
    if (validationErrors.length) {
      throw new ValidationError('Validation failed', validationErrors, value);
    }
  }
}

function publish(errors: Array<clv.ValidationError>, previousProperty?: string) {
  const result: Array<{constraints: Record<string, string>, property: string}> = [];
  errors.forEach(error => publishMap(error, result, previousProperty));
  return result;
}

function publishMap(error: clv.ValidationError, result: Array<{constraints: Record<string, string>, property: string}>, previousProperty?: string) {
  const property = previousProperty ? `${previousProperty}.${error.property}` : error.property;
  if (error.constraints) result.push(({property, constraints: error.constraints}))
  if (error.children) result.push(...publish(error.children, property));
}

async function validateArrayAsync<T>(cls: Array<ncm.Type<T>>, value: Array<T> | T) {
  if (!Array.isArray(value)) return [{property: '$', constraints: {array: 'Not an array'}, children: []}];
  const validationErrors = await Promise.all(value.map(x => validateSingleAsync(cls[0], x)));
  validationErrors.forEach((x, i) => x.forEach(y => y.property = `[${i}].${y.property}`));
  return validationErrors.reduce((p, c) => p.concat(c), [] as Array<clv.ValidationError>);
}

async function validateSingleAsync<T>(cls: ncm.Type<T>, value: Array<T> | T) {
  if (Array.isArray(value)) return [{property: '$', constraints: {array: 'Is an array'}, children: []}];
  if (value instanceof cls) return await clv.validate(value);
  return await clv.validate(clt.plainToClass(cls, value));
}
