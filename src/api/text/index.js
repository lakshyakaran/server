import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { done } from '../../services/response/'
import { xApi, token } from '../../services/passport'
import { create } from './controller'


const router = new Router()

router.post('/',
	xApi(),
	token({ required: true, roles: ['admin'] }),
	(req, res) => create(req, res, done))

export default router
