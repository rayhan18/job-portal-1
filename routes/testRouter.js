import express  from "express";
const router = express.Router()
import {testPostController} from '../controllers/testController.js'
import userAuth from "../middelwares/authMiddelware.js";


router.post('/testing', userAuth, testPostController)



export default router;