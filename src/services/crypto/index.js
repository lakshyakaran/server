import crypto, { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { secretSalt, payu } from '../../config'

const aad = Buffer.from('0123456789', 'hex')
const hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10"

export const generateToken = (code) => {
	const nonce = randomBytes(12)
	const cipher = createCipheriv('aes-192-gcm', secretSalt, nonce)

	cipher.setAAD(aad, {
		plaintextLength: Buffer.byteLength(code)
	})

	const token = Buffer.concat([cipher.update(code, 'utf8'), cipher.final()])
	const authTag = cipher.getAuthTag()
	
	return (Buffer.concat([nonce, authTag, token]).toString('base64')).replace(/\//g, '_').replace(/\+/g, '.').replace(/=/g, '-')
}

export const decryptToken = (token) => {
	const rawData = Buffer.from(token.replace(/_/g, '/').replace(/\./g, '+').replace(/-/g, '='), 'base64')
	let nonce = rawData.slice(0, 12)
	let authTag = rawData.slice(12, 28)
	let data = rawData.slice(28)

	const decipher = createDecipheriv('aes-192-gcm', secretSalt, nonce)
	decipher.setAuthTag(authTag)
	decipher.setAAD(aad, {
		plaintextLength: token.length
	})

	try {
		return decipher.update(data, 'binary', 'utf8') + decipher.final('utf8')
	} catch (err) {
		return null
	}
}

export const hashBeforeTransaction = (data) => {
	let string = ""
	let sequence = hashSequence.split('|')
	if (!(data && payu.salt)){
		return false
	}
	for (let i = 0; i < sequence.length; i++) {
		let k = sequence[i]
		if(data[k] !== undefined){
			string += data[k] + '|'
		}else{
			string += '|'
		}
	}
	string += payu.salt
	return crypto.createHash('sha512', payu.salt).update(string).digest('hex')
}

export const hashAfterTransaction = (data) => {
	let k = "",
		string = ""

	let sequence = hashSequence.split('|').reverse()
	if (!(data && payu.salt && transactionStatus)){
		return false
	}

	string += payu.salt + '|' + transactionStatus + '|'
	for(let i = 0; i < sequence.length; i++) {
		k = sequence[i]
		if(data[k] !== undefined){
			string += data[k] + '|'
		}else{
			string += '|'
		}
	}

	string = string.substr(0, string.length - 1)

	return crypto.createHash('sha512', payu.salt).update(string).digest('hex')
}