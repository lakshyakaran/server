/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
	if (!process.env[name]) {
		throw new Error('You must set the ' + name + ' environment variable')
	}
	console.log(name, process.env[name])
	return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv-safe')
	dotenv.load({
		path: path.join(__dirname, '../.env'),
		sample: path.join(__dirname, '../.env.example')
	})
}

const config = {
	all: {
		env: process.env.NODE_ENV || 'development',
		root: path.join(__dirname, '..'),
		port: process.env.PORT || 9000,
		ip: process.env.IP || '0.0.0.0',
		siteBase: 'http://localhost:9000',
		apiRoot: process.env.API_ROOT || '',
		xApiKey: requireProcessEnv('X_API_KEY'),
		jwtSecret: requireProcessEnv('JWT_SECRET'),
		secretSalt: requireProcessEnv('SECRET_SALT'),
		adminKey: requireProcessEnv('ADMIN_KEY'),
		otpExpiresIn: 60 * 5,
		msg91: {
			apiBase: "http://api.msg91.com/api/sendhttp.php",
			// apiBase: "http://api.msg91.com/api/v2/sendsms",
			authkey: "181964ASuehXXhrB59fb3097",
			sender: "TSTYSLP",
			route: 4
		},
		sendText: false,
		mongo: {
			options: {
				db: {
					safe: true
				}
			}
		},
	},
	test: { },
	development: {
		mongo: {
			uri: 'mongodb://localhost/tastyslop-dev',
			options: {
				debug: true
			}
		},
		payu: {
			merchantID: 5804204,
			key: 'CmB8BBqg',
			salt: 'WDHB59ixeb',
			authorizationHeader: '3pWPY6neZmhLNInNvdQFdKBHXxfdi6UKV61UEOQqd7o=',
			host: 'https://www.payumoney.com/sandbox',
			path: {
				refundEndpoint: '/treasury/merchant/refundPayment',
				paymentResponse: '/payment/op/getPaymentResponse'
			}
		}
	},
	production: {
		ip: process.env.IP || undefined,
		port: process.env.PORT || 8080,
		mongo: {
			uri: process.env.MONGODB_URI || 'mongodb://localhost/tastyslop'
		}
	}
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
