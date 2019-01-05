import { jwtSign, jwtVerify } from '../../services/jwt/'
import { generateToken, decryptToken } from '../../services/crypto'
import { generateRandomDigits } from '../../services/helper'
import { sendVerificationCode, verifyVerificationCode } from '../text/controller'
import { User } from './model'


export const sendOtp = async ( body ) => {
	try{
		const phone = body.phone
		const verificationCode = generateRandomDigits(4)
		const message = `${verificationCode} is your OTP to register on HopIn. The OTP is valid for 5 mins. Please do not share it with anyone.`
		const response = await sendVerificationCode({ phone, verificationCode, message })
		if(response.status === 200){
			return {
				status: 200,
				entity: {
					success: true,
					verificationToken: response.entity.verificationToken					
				}
			}
		}
		return response
	} catch (error) {
		return {
			status: 400,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

export const verifyOtp = async ( body ) => {
	try{
		const response = await verifyVerificationCode(body)
		if(response.status === 200){
			return {
				status: 200,
				entity: {
					success: true,
					signUpToken: response.entity.signUpToken					
				}
			}
		}
		return response
	} catch (error) {
		return {
			status: 400,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

export const create = async ( body ) => {
	try{
		const decodedToken = jwtVerify(body.signUpToken)
		if(decodedToken.phone == body.phone){
			body.slugName = `${body.name.firstName}${body.name.lastName}`
			const user = await User.create(body)
			if(user._id){
				const refreshToken = generateToken(user._id.toString())
				const accessToken = jwtSign({id: user._id.toString()})
				return {
					status: 200,
					entity: {
						success: true,
						user: user.view(true),
						refreshToken,
						accessToken
					}
				}
			}
		}
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Invalid parameters.'
			}
		}
	}catch (error){
		if (error.name === 'MongoError' && error.code === 11000) {
			return {
				status: 409,
				entity: {
					success: false,
					error: 'Phone number already registered.'
				}
			}
		}else if (error.name === 'TokenExpiredError'){
			return {
				status: 400,
				entity: {
					success: false,
					error: 'Signup token has expired.'
				}
			}
		}
		return {
			status: 409,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

export const update = async ( body, user ) => {
	try{
		if(user._id){
			if(body.teachers && user.userType !== 'INSTITUTE'){
				return {
					status: 400,
					entity: {
						success: false,
						error: 'Invalid parameters.'
					}
				}
			}
			const updateResponse = await Object.assign(user, body).save()
			if(updateResponse._id){
				return {
					status: 200,
					entity: {
						success: true,
						user: updateResponse.view(true)
					}
				}
			}
		}
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Invalid parameters.'
			}
		}
	}catch(error){
		console.log("error ==>")
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

export const userData = async ( params ) => {
	try{
		const user = await User.findById(params.id)
		if(user._id){
			return {
				status: 200,
				entity: {
					success: true,
					user
				}
			}
		}
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Invalid user ID.'
			}
		}
	}catch(error){
		return {
			status: 409,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

// export const index = ({ querymen: { query, select, cursor } }, res, callback) =>
// 	User.find(query, select, cursor)
// 		.then(users => users.map(user => user.view()))
// 		.then(data => callback(res, 200, data))
// 		.catch(error => callback(res, 400, error))

// export const show = ({ params }, res, callback) =>
// 	User.findById(params.id)
// 		.then(user => user ? user.view() : null)
// 		.then(data => callback(res, 200, data))
// 		.catch(error => callback(res, 400, error))


// export const showMe = ({ user }, res, callback) =>
// 	callback(res, 200, user.view(true))


// export const update = ({ bodymen: { body }, params, user }, res, callback) =>
// 	User.findById(params.id === 'me' ? user.id : params.id)
// 		.then(callback(res, 404))
// 		.then((result) => {
// 			if (!result) return null
// 			const isAdmin = user.role === 'admin'
// 			const isSelfUpdate = user.id === result.id
// 			if (!isSelfUpdate && !isAdmin) {
// 				res.status(401).json({
// 					valid: false,
// 					message: 'You can\'t change other user\'s data'
// 				})
// 				return null
// 			}
// 			return result
// 		})
// 		.then(user => user ? Object.assign(user, body).save() : null)
// 		.then(user => user ? user.view(true) : null)
// 		.then(data => callback(res, 200, data))
// 		.catch(error => callback(res, 400, error))

// export const updatePassword = ({ bodymen: { body }, params, user }, res, callback) =>
// 	User.findById(params.id === 'me' ? user.id : params.id)
// 		.then(callback(res, 404))
// 		.then((result) => {
// 			if (!result) return null
// 			const isSelfUpdate = user.id === result.id
// 			if (!isSelfUpdate) {
// 				callback(res, 401, {
// 					valid: false,
// 					param: 'password',
// 					message: 'You can\'t change other user\'s password'
// 				})
// 				return null
// 			}
// 			return result
// 		})
// 		.then(user => user ? user.set({ password: body.password }).save() : null)
// 		.then(user => user ? user.view(true) : null)
// 		.then(data => callback(res, 200, data))
// 		.catch(error => callback(res, 400, error))

// export const destroy = ({ params }, res, callback) =>
// 	User.findById(params.id)
// 		.then(callback(res, 404))
// 		.then(user => user ? user.remove() : null)
// 		.then(data => callback(res, 204, data))
// 		.catch(error => callback(res, 400, error))
