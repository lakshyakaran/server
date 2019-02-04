import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { done } from '../../services/response/'
import { xApi, token } from '../../services/passport'
import { initiateTransaction } from './controller'


const router = new Router()

router.post('/initiate',
	xApi(),
	token({ required: true }),
	async (req, res) => done(res, await initiateTransaction(req.body, req.user)))

router.post('/update',
	async (req, res) => done(res, await updateTransaction(req.body)))

// router.get('/course/:id',
// 	xApi(),
// 	token({ required: true }),
// 	async (req, res) => done(res, await showCourseSubscription(req.params, req.user)))

// router.get('/:id',
// 	xApi(),
// 	token({ required: true }),
// 	async (req, res) => done(res, await show(req.params, req.user)))

export default router
