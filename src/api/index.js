import { Router } from 'express'
import user from './user'
import oauth from './oauth'
import text from './text'
import meals from './meals'

const router = new Router()

router.use('/users', user)
router.use('/oauth', oauth)
router.use('/text', text)
router.use('/meals', meals)

export default router
