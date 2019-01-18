import _ from 'lodash'
import { Meals } from './model'

export const list = async ({offset, limit}) => {
	try{
		const meals = await Meals
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
				meals: meals
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
		const meal = await Meals.create(body)
		if(meal._id){
			return {
				status: 200,
				entity: {
					success: true,
					meal: meal
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
		const meal = await Meals.findById(id)
		if(meal._id){
			const updateResponse = await Object.assign(meal, body).save()
			if(updateResponse._id){
				return {
					status: 200,
					entity: {
						success: true,
						meal: updateResponse
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