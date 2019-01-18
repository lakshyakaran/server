import { jwtSign, jwtVerify } from '../../services/jwt/'
import { invokeApi } from '../../services/helper/'
import { otpExpiresIn, msg91, sendText } from '../../config'
import { Text } from './model'

export const sendMessage = async (body) => {
	try{
		console.log(body.message)
		const response = await Text.create(body)
		if(response._id){
			if(sendText){
				const url = msg91.apiBase
				const method = 'GET'
				const params = {
					sender: msg91.sender,
					route: msg91.route,
					mobiles: `91${response.phone}`,
					authkey: msg91.authkey,
					country: `91`,
					message: body.message
				}
				const textResponse = await invokeApi({ url, method, params })
				if(textResponse){
					return {
						status: 200,
						entity: {
							success: true,
							...response
						}
					}
				}
				response.delete()				
			}else{
				return {
					status: 200,
					entity: {
						success: true,
						...response
					}
				}
			}
		}
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Invalid Parameters'
			}
		}
	}catch(error){
		console.log(error)
		return {
			status: 400,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

export const sendVerificationCode = async ( { phone, message, verificationCode} ) => {
	try{
		const response = await sendMessage({ phone, message, verificationCode })
		if(response.status === 200){
			return {
				status: 200,
				entity: {
					success: true,
					verificationToken: jwtSign({phone, verificationCode}, {expiresIn: otpExpiresIn})
				}
			}
		}
		return response
	}catch(error){
		return {
			status: 400,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

export const verifyVerificationCode = async ( { phone, verificationCode, verificationToken } ) => {
	try{
		const decodedToken = jwtVerify(verificationToken)
		console.log(decodedToken.phone == phone)
		console.log(decodedToken.verificationCode)
		console.log(verificationCode)
		if(decodedToken.phone == phone && decodedToken.verificationCode == verificationCode){
			return {
				status: 200,
				entity: {
					success: true,
					signUpToken: jwtSign({ phone }, { expiresIn: otpExpiresIn })
				}
			}			
		}
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Invalid verification code.'
			}
		}
	}catch(error){
		console.log(error)
		return {
			status: 400,
			entity: {
				success: false,
				error: error.name == 'TokenExpiredError' ? 'OTP has expired.' : 'Invalid verification code.'
			}
		}
	}
}
