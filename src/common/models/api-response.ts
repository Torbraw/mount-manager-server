/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom-error';

export const CustomApiBadRequestResponse = (description?: string) =>
  ApiResponse({
    description: description
      ? `The provided parameter(s) is either missing or incorrect. / ${description}`
      : 'The provided parameter(s) is either missing or incorrect.',
    type: CustomError,
    status: HttpStatus.BAD_REQUEST,
  });

export const CustomApiNotFoundResponse = (description: string) =>
  ApiResponse({
    description: description,
    type: CustomError,
    status: HttpStatus.NOT_FOUND,
  });

export const ApiUnexpectedErrorResponse = () =>
  ApiResponse({
    description: 'An unexpected error has occured.',
    type: CustomError,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  });

export const CustomApiForbiddenResponse = () =>
  ApiResponse({
    description: 'Forbidden ressource.',
    type: CustomError,
    status: HttpStatus.FORBIDDEN,
  });

export const CustomApiUnauthorizedResponse = () =>
  ApiResponse({
    description: 'Unauthorized.',
    type: CustomError,
    status: HttpStatus.UNAUTHORIZED,
  });
