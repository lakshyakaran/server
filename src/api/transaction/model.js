import mongoose, { Schema } from 'mongoose'

const transactionType = ['CHARGED', 'REFUND']
const status = ['PENDING', 'COMPLETED', 'FAILED']
const transactionSchema = new Schema({
	user: {type: String, ref: 'User', required: true},
	plan: {type: String, ref: 'Plan', required: true},
	transactionType: {type: String, enum : transactionType, required: true},
	transactionHandler: {type: String},
	transactionAmount: {type: Number, required: true},
	transactionData: {type: Object, default: null},
	status: {type: String, enum: status, default: 'PENDING'}
}, {
	timestamps: true
})

// subscriptionSchema
// 	.pre('find', function(next){
// 	this.populate('plan')
// 	next()
// 	})

// subscriptionSchema
// 	.pre('findOne', function(next){
// 	this.populate('plan')
// 	next()
// 	})

export const Transaction = mongoose.model('Transaction', transactionSchema)
