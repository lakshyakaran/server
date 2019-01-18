import mongoose, { Schema } from 'mongoose'

const category = ['BREAKFAST', 'LUNCH', 'DINNER']
const type = ['VEG', 'NON_VEG']

const mealsSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, default: null},
	images: [{
		url: {type: String, required: true}
	}],
	category: {type: String, enum: category, required: true},
	type: {type: String, enum: type, required: true}
}, {
	timestamps: true
})

export const Meals = mongoose.model('Meals', mealsSchema)
