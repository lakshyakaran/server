import _ from 'lodash'
import { hashBeforeTransaction, hashAfterTransaction } from '../../services/crypto'
import { createOrder } from '../../services/razorpay'
import { razorpay, siteBase, siteName } from '../../config'
import { show as showPlan } from '../plan/controller'
import { create as createSubscription } from '../subscription/controller'
import { Transaction } from './model'

const frequencyMap = {
	'DAY': 'd',
	'WEEK': 'w',
	'MONTH': 'M',
	'YEAR': 'y'
}
export const initiateTransaction = async (body, {_id, email, phone, name}) => {
	try{
		const planResponse = await showPlan({ id: body.plan })
		if(planResponse.status === 200 && planResponse.entity.success){
			const amountToPay = parseFloat(planResponse.entity.plan.price)
			const  transactionData = {
				user: _id,
				plan: planResponse.entity.plan,
				transactionType: 'CHARGED',
				transactionHandler: 'RazorPay',
				transactionAmount: amountToPay,
				status: 'PENDING'
			}
			const transaction = await Transaction.create(transactionData)
			if(transaction._id){
				console.log(transaction._id)
				const orderId = await createOrder({
					amount: amountToPay,
					currency: 'INR',
					receipt: transaction._id.toString()
				})
				transaction.orderId = orderId
				await transaction.save()
				const generatedRequestData = {
					'key': razorpay.id,
					'image': 'https://i.imgur.com/3g7nmJC.png',
					'description': 'Meal Subscription',
					'amount': amountToPay,
					'currency': 'INR',
					'external': {
						wallets: ['paytm']
					},
					'name': siteName,
					'prefill': {
						'email': email ? email : '',
						'contact': phone,
						'name': name.firstName + (name.lastname ? ' ' + name.lastname : ''),
					},
					'order_id': transaction.orderId,
					'theme': {
						'emi_mode': true
					}
					// 'hash': generatedHash
				}
				return {
					status: 200,
					entity: {
						paymentRequired: amountToPay > 0 ? true : false,
						paymentData: generatedRequestData
					}
				}
			}
		}
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Something went wrong.'
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

export const updateTransaction = async (body) => {
	try{
		const transaction = await Transaction.findById(body.txid)
		if(transaction._id && transaction.status === 'PENDING' && transaction.transactionAmount > 0){
			const plan = await showPlan(transaction.plan).entity.plan
			const generatedHash = hashAfterTransaction(body, body.status)
			if(generatedHash === body.hash){
				if(body.status.toLowerCase() === 'success'){
					transaction.status = 'COMPLETED'
				}else{
					transaction.status = 'FAILED'
				}
				transaction.transactionData = body
				await transaction.save()
				if(transaction.status === 'COMPLETED'){
					const startDate = moment.unix().valueOf()
					const endDate = moment.unix(startDate).add(plan.days, 'd').valueOf()
					const subscriptionData = {
						userId: transaction.user,
						planId: plan._id,
						startDate:startDate,
						endDate: endDate,
						status: 'SUBSCRIBED'
					}
					const subscriptionResponse = await createSubscription(subscriptionData, {_id: transaction.user})
					return {
						status: 200,
						entity: {
							subscriptionResponse: subscriptionResponse
						}
					}
				}else{
					return {
						status: 200,
						entity: {
							success: false,
							response: 'Transaction has failed.'
						}
					}
				}
			}
		}
		return {
			status: 400,
			entity: {
				success: false,
				error: 'Invalid transaction data.'
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