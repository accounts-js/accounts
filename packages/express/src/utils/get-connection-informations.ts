import { getClientIp } from 'request-ip';

const getUserAgent = req => {
	let userAgent = req.headers['user-agent'] || '';
	if (req.headers['x-ucbrowser-ua']) {
		// special case of UC Browser
		userAgent = req.headers['x-ucbrowser-ua'];
	}
	return userAgent;
};

export const getConnectionInformations = (req) => ({
		userAgent: getUserAgent(req),
		ip: getClientIp(req)
})
