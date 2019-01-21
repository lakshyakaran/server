import mongoose, { Schema } from 'mongoose'

const mealsIncluded = ['BREAKFAST', 'LUNCH', 'DINNER']

const subscriptionSchema = new Schema({
	planName: {
		type: String, required: true
	},
	days: {
		type: Number, required: true
	},
	mealsCount: {
		type: Number, required: true
	},
	mealsIncluded:[{
		type: String, enum: mealsIncluded, required: true
	}],
	price: {
		type: Number, required: true
	}
}, {
	timestamps: true
})

export const Subscription = mongoose.model('Subscription', subscriptionSchema)
