const express = require("express");
const activitySubmissionController = require("../controllers/activitySubmissions");
const { isStudent } = require('../utils/roles');
const { tokenExtractor, userExtractor } = require('../utils/middleware');

const router = express.Router();

router.get("/", tokenExtractor, userExtractor, isStudent, activitySubmissionController.getActivitySubmissions);
router.get("/:id", tokenExtractor, userExtractor, isStudent, activitySubmissionController.getActivitySubmissionById);
router.post("/", tokenExtractor, userExtractor, isStudent, activitySubmissionController.createActivitySubmission);
router.put("/:id", tokenExtractor, userExtractor, isStudent, activitySubmissionController.updateActivitySubmission);
router.delete("/:id", tokenExtractor, userExtractor, isStudent, activitySubmissionController.deleteActivitySubmission);

module.exports = router;
