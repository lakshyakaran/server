import mongoose, { Schema } from 'mongoose'

const subscriptionSchema = new Schema({
	planId: {type: String, required: true},
	userId: {type: String, default: true},
	startDate: {type: Number, required: true},
	endDate: {type: Number, required: true},
	mealsAvailable: {type: String, required: true},
	suscribedOn: {type: Number, required: true},
	status: {type: String, enum: ['SUBSCRIBED', 'EXPIRED'], required: true},
}, {
	timestamps: true
})

export const Subscription = mongoose.model('Subscription', subscriptionSchema)
