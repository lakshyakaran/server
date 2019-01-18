import { Router } from 'express'
import { done } from '../../services/response/'
import { token, xApi } from '../../services/passport'
import { create, update, list } from './controller'

const router = new Router()

router.post('/',
	xApi(),
	token({ required: true, roles: ['admin'] }),
	async (req, res) => done(res, await create(req.body, req.user)))

router.put('/:id',
	xApi(),
	token({ required: true, roles: ['admin'] }),
	async (req, res) => done(res, await update(req.params, req.body, req.user)))

router.get('/',
	xApi(),
	async (req, res) => done(res, await list(req.query)))

export default router
