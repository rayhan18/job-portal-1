import express from 'express'
import {loginController, registerController} from '../controllers/authController.js'
import { rateLimit } from 'express-rate-limit'


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
	legacyHeaders: false, // X-RateLimit-* headers
	// store: ... , // Use an external store for more precise rate limiting
})

const router = express.Router()

router.post('/register',limiter, registerController)
router.post('/login',limiter, loginController)

export default router;