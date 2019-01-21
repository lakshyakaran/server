import _ from 'lodash'
import { Subscription } from './model'

export const list = async ({selectedMeals}) => {
	try{
		const condition = {
			mealsIncluded: selectedMeals.split(',')
		}
		const subscription = await Subscription
							.find(condition)
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
		if(meal._id){
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