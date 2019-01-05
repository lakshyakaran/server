import request from 'request'

export const generateRandomDigits = (length) => Math.floor(Math.random()*parseInt('8' + '9'.repeat(length-1))+parseInt('1' + '0'.repeat(length-1)))

export const invokeApi = ({ url, method, params, body, authorization }) => {
	return new Promise((resolve, reject) => {
		const headers = {
			'User-Agent':       'Super Agent/0.0.1',
			'Content-Type':     'application/json'
		}
		if(authorization){
			headers.Authorization = authorization
		}
		const options = {
			url: url,
			method: method,
			headers: headers,
			qs: params
		}
		request(options, (error, response, body) => {
			if(!error && response.statusCode == 200){
				resolve(body)
			}
			reject(error)
		})
	})
}