import { CookieOptions, Response } from 'express';
import { Details } from 'express-useragent';
import { DeviceType, TokenEnum } from 'src/models/helper.models';

const is_production = process.env.NODE_ENV === 'production';

const cookieOptions: CookieOptions = {
	maxAge: 1000 * 60 * 60 * 24 * 30,
	httpOnly: true,
	sameSite: is_production ? 'none' : 'lax',
	path: '/',
	secure: is_production,
	expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30),
	domain: is_production ? '.divyansh.co.in' : 'localhost',
};

/**
 * The function `clearCookies` in TypeScript clears a specific cookie or all cookies based on the
 * provided cookie name.
 * @param {Response} response - The `response` parameter is typically an object that represents the
 * HTTP response that will be sent back to the client from the server. It is commonly used in web
 * development to set headers, send data, and manage cookies.
 * @param {string} [cookieName] - The `cookieName` parameter is a string that represents the name of a
 * specific cookie that you want to clear from the response. If `cookieName` is provided, only that
 * specific cookie will be cleared. If `cookieName` is not provided, all cookies defined in the
 * `TokenEnum`
 */
export function clearCookies(response: Response, cookieName?: string) {
	if (cookieName) {
		response.clearCookie(cookieName);
	} else {
		Object.values(TokenEnum).forEach((key) => {
			response.clearCookie(key);
		});
	}
}

/**
 * The function `setCookie` is used to set a cookie with the specified name and value in a TypeScript
 * application.
 * @param {Response} response - The `response` parameter is typically an object representing the HTTP
 * response that will be sent back to the client. It is commonly used in web development to set
 * cookies, send data, and control the response behavior.
 * @param {string} name - The `name` parameter in the `setCookie` function is a string that represents
 * the name of the cookie you want to set.
 * @param {string} value - The `value` parameter in the `setCookie` function represents the value that
 * you want to set for the cookie with the specified name. This value can be a string containing any
 * data that you want to store in the cookie, such as user preferences, session information, or other
 * relevant data.
 */
export function setCookie(response: Response, name: string, value: string) {
	response.cookie(name, value, { ...cookieOptions });
}

/**
 * The function `getDeviceType` takes a user agent object and returns the device type based on whether
 * it is a mobile, tablet, desktop, or TV.
 * @param {Details} useragent - The useragent parameter is an object that contains details about the
 * user's device. It typically includes properties such as isMobile, isTablet, and isDesktop, which
 * indicate whether the device is a mobile phone, tablet, or desktop computer, respectively.
 * @returns the device type based on the user agent details.
 */
export function getDeviceType(useragent: Details): DeviceType {
	if (useragent.isMobile) {
		return DeviceType.MOBILE;
	}

	if (useragent.isTablet) {
		return DeviceType.TABLET;
	}

	if (useragent.isDesktop) {
		return DeviceType.DESKTOP;
	}

	return DeviceType.TV;
}
