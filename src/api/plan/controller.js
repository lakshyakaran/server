import _ from 'lodash'
import { Plan } from './model'


export const show = async ({ id }) => {
	try{
		const plan = await Plan.findById(id)
		return {
			status: 200,
			entity: {
				success: true,
				plan:  plan || {}
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

export const list = async ({selectedMeals}) => {
	try{
		const condition = {
			mealsIncluded: selectedMeals.split(',')
		}
		const plan = await Plan
							.find(condition)
							.sort({
								timestamps: 'desc'
							})
							.exec()
		return {
			status: 200,
			entity: {
				success: true,
				plan: plan
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
		const plan = await Plan.create(body)
		if(plan._id){
			return {
				status: 200,
				entity: {
					success: true,
					plan: plan
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
		const plan = await Plan.findById(id)
		if(plan._id){
			const updateResponse = await Object.assign(plan, body).save()
			if(updateResponse._id){
				return {
					status: 200,
					entity: {
						success: true,
						plan: updateResponse
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