import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import { createAdmin } from './seedDb'
import api from './api'

const app = express(apiRoot, api)
const server = http.createServer(app)

mongoose.connect(mongo.uri, {
	useNewUrlParser: true,
	useCreateIndex: true
})
// mongoose.Promise = Promise



setImmediate(async () => {
	try{
		const admin = await createAdmin()
		if(admin){
			console.log("Admin user => ", admin.phone)
		}else{
			console.log("Unable to create admin ")
		}		
	}catch(error){
		console.log(error)
	}
	server.listen(port, ip, () => {
		console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
	})
})

export default app
