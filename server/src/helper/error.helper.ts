import { HttpStatus } from '@nestjs/common';
import * as Exceptions from '@nestjs/common/exceptions';

export type ExceptionName = keyof typeof Exceptions;

/**
 * The function `getExceptionCode` returns an error code based on the provided HTTP status code.
 * @param {number} statusCode - The `getExceptionCode` function takes a `statusCode` parameter as input
 * and returns an error code based on the provided status code. The function checks the `statusCode`
 * against various HTTP status codes and assigns the corresponding error code.
 * @returns The function `getExceptionCode` returns an error code based on the input `statusCode`. The
 * error code returned is of type `ExceptionName` or `'TooManyRequestsException'`.
 */
export function getExceptionCode(statusCode: number) {
	let error_code: ExceptionName | 'TooManyRequestsException' = 'InternalServerErrorException';
	if (statusCode === HttpStatus.NOT_FOUND) error_code = 'NotFoundException';
	if (statusCode === HttpStatus.BAD_GATEWAY) error_code = 'BadGatewayException';
	if (statusCode === HttpStatus.BAD_REQUEST) error_code = 'BadRequestException';
	if (statusCode === HttpStatus.UNAUTHORIZED) error_code = 'UnauthorizedException';
	if (statusCode === HttpStatus.CONFLICT) error_code = 'ConflictException';
	if (statusCode === HttpStatus.NOT_IMPLEMENTED) error_code = 'NotImplementedException';
	if (statusCode === HttpStatus.FORBIDDEN) error_code = 'ForbiddenException';
	if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) error_code = 'UnprocessableEntityException';
	if (statusCode === HttpStatus.GATEWAY_TIMEOUT) error_code = 'GatewayTimeoutException';
	if (statusCode === HttpStatus.SERVICE_UNAVAILABLE) error_code = 'ServiceUnavailableException';
	if (statusCode === HttpStatus.REQUEST_TIMEOUT) error_code = 'RequestTimeoutException';
	if (statusCode === HttpStatus.HTTP_VERSION_NOT_SUPPORTED)
		error_code = 'HttpVersionNotSupportedException';
	if (statusCode === HttpStatus.I_AM_A_TEAPOT) error_code = 'ImATeapotException';
	if (statusCode === HttpStatus.METHOD_NOT_ALLOWED) error_code = 'MethodNotAllowedException';
	if (statusCode === HttpStatus.MISDIRECTED) error_code = 'MisdirectedException';
	if (statusCode === HttpStatus.PRECONDITION_FAILED) error_code = 'PreconditionFailedException';
	if (statusCode === HttpStatus.NOT_ACCEPTABLE) error_code = 'NotAcceptableException';
	if (statusCode === HttpStatus.PAYLOAD_TOO_LARGE) error_code = 'PayloadTooLargeException';
	if (statusCode === HttpStatus.UNSUPPORTED_MEDIA_TYPE)
		error_code = 'UnsupportedMediaTypeException';
	if (statusCode === HttpStatus.GONE) error_code = 'GoneException';
	if (statusCode === HttpStatus.TOO_MANY_REQUESTS) error_code = 'TooManyRequestsException';

	return error_code;
}

export const Error = {
	USER_NOT_FOUND:
		'Oops! This email is not registered with us, please try again with a different email',
	USER_ALREADY_EXISTS: 'This email is already registered. Please try with different email!',
	USER_NOT_AUTHORIZED: '',
	USER_INVALID_CREDENTIALS: 'Invalid credentials! Please try again.',
	USER_INVALID_TOKEN: 'Hey! Your session has expired. Please login again.',
	USER_INVALID_REFRESH_TOKEN: 'Session expired! Please login again.',
	USER_INVALID_EMAIL: '',
	USER_INVALID_PASSWORD: '',
	INTERNAL_SERVER_ERROR: 'Oops! Seems like the server has crashed. Please try again later.',
	FAILED_TO_CREATE_ACCOUNT: 'Failed to create account. Please try again later.',
};
