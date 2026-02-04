const router = require("express").Router();
const activityController = require("../controllers/activityController");
const { auth } = require("../middlewares/authMiddleware");

/*Recent Activities */
router.get("/recent-activity", auth, activityController.getRecentActivity);

module.exports = router;
