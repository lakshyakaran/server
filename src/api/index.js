import { Router } from 'express'
import user from './user'
import oauth from './oauth'
import text from './text'

const router = new Router()

router.use('/users', user)
router.use('/oauth', oauth)
router.use('/text', text)

export default router
