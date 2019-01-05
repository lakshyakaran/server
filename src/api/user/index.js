import { Router } from 'express'
import { done } from '../../services/response/'
import { password as passwordAuth, xApi, token } from '../../services/passport'
import { sendOtp, verifyOtp, create, update, updatePassword, destroy } from './controller'

const router = new Router()

router.post('/send-otp',
	xApi(),
	async (req, res) => done(res, await sendOtp(req.body)))

router.post('/verify-otp',
	xApi(),
	async (req, res) => done(res, await verifyOtp(req.body)))

router.post('/',
	xApi(),
	async (req, res) => done(res, await create(req.body)))

router.put('/',
	xApi(),
	token(),
	async (req, res) => done(res, await update(req.body, req.user)))

router.get('/me',
	xApi(),
	token(),
	async (req, res) => done(res, {status: 200, entity: {success: true, user: req.user.view(true)}}))

export default router
