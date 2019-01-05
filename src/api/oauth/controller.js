import { generateToken, decryptToken } from '../../services/crypto'
import { jwtSign, jwtVerify } from '../../services/jwt/'
import { userData } from '../user/controller'

export const login = async ( user ) => {
	try{
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
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Oops! Something went wrong.'
			}
		}
	}catch (error){
		return {
			status: 409,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

export const token = async ( query ) => {
	try {
		const refreshToken = query.refreshToken
		const id = decryptToken(query.refresh_token || query.refreshToken)
		if(!id) {
			return {
				status: 401,
				entity: {
					success: false,
					error: 'Invalid token.'
				}
			}
		}
		return {
			status: 200,
			entity: {
				success: true,
				refreshToken: generateToken(id),
				accessToken: jwtSign({ id })
			}
		}
	}catch (error){
		return {
			status: 401,
			entity: {
				success: false,
				error: error.errors || 'Invalid token.'
			}
		}
	}
}