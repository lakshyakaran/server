import _ from 'lodash'
import { Subscription } from './model'

export const list = async ({offset, limit}) => {
	try{
		const subscription = await Subscription
							.find()
							.limit(limit || 100)
							.skip(offset || 0)
							.sort({
								timestamps: 'desc'
							})
							.exec()
		return {
			status: 200,
			entity: {
				success: true,
				subscription: subscription
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

export const create = async ( body, {_id} ) => {
	try{
		const subscription = await Subscription.create(body)
		if(subscription._id){
			return {
				status: 200,
				entity: {
					success: true,
					subscription: subscription
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
		console.log(error)
		return {
			status: 409,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}

export const update = async ({ id }, body, { role }) => {
	try {
		const subscription = await Subscription.findById(id)
		if(subscription._id){
			const updateResponse = await Object.assign(subscription, body).save()
			if(updateResponse._id){
				return {
					status: 200,
					entity: {
						success: true,
						subscription: updateResponse
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
		return {
			status: 409,
			entity: {
				success: false,
				error: error.errors || error
			}
		}
	}
}