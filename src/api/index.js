import { Router } from 'express'
import user from './user'
import oauth from './oauth'
import text from './text'
import meals from './meals'
import plan from './plan'
import subscription from './subscription'
import transaction from './transaction'

const router = new Router()

router.use('/users', user)
router.use('/oauth', oauth)
router.use('/text', text)
router.use('/meals', meals)
router.use('/plan', plan)
router.use('/transaction', transaction)

export default router
