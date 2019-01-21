import { Router } from 'express'
import user from './user'
import oauth from './oauth'
import text from './text'
import meals from './meals'
import subscription from './subscription'

const router = new Router()

router.use('/users', user)
router.use('/oauth', oauth)
router.use('/text', text)
router.use('/meals', meals)
router.use('/subscription', subscription)

export default router
