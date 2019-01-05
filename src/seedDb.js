import { User } from './api/user/model'

export const createAdmin = async () => {
	const adminData = {
		"name": {
			"firstName": "Lakshya",
			"lastName": "Karan"
		},
		"email": "lakshyakaran@gmail.com",
		"phone": 8804843204,
		"password": "password",
		"role": "admin",
		"username": "lakshyakaran",
		"slugName": "lakshyakaran"
	}
	try{
		const admin = await User
		.findOne({
			"phone": 8804843204
		})
		.exec()
		if(!admin){
			const admin = await createNewUser(adminData)
			if(admin){
				return admin
			}
			return null
		}
		return admin	
	}catch(error){
		return null
	}
}

const createNewUser = async (userData) => {
	const newUser = await User.create(userData)
	if(!newUser){
		return null
	}
	return newUser
}