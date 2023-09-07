import express  from "express";
import userAuth from "../middelwares/authMiddelware.js";
import { createJobController, getJobController, updateJObController,deleteJobController, jobStatusController } from "../controllers/jobController.js";

const router = express.Router()

router.post('/create-post', userAuth ,createJobController)
router.get('/get-jobs', userAuth ,getJobController)
router.patch('/update-job/:id', userAuth , updateJObController)
router.delete('/delete-job/:id', userAuth , deleteJobController)
router.get('/job-stats', userAuth , jobStatusController)


export default router