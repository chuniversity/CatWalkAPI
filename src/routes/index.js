const { Router } = require('express')

const homeRoutes = require('./home')
const reviewRoutes = require('./reviews')
const userRoutes = require('./users')

const router = Router()

router.use('/', homeRoutes)
router.use('/reviews', reviewRoutes)
router.use('/users', userRoutes)

module.exports = router;

