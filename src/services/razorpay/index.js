import Razorpay from 'razorpay'
import { razorpay } from '../../config'

const razorpayInstance = new Razorpay({
	key_id: razorpay.id,
	key_secret: razorpay.secret
})

export const createOrder = async (orderJSON) => {
	try{
		const orderResponse = await razorpayInstance.orders.create(orderJSON)
		console.log(orderResponse)
		return orderResponse.id
	}catch(error){
		console.log(error)
	}
}