const router = require("express").Router();
const liveController = require("../controllers/liveController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/", auth, liveController.createLive);

router.get("/", auth, liveController.getLive);

router.put("/:id", auth, liveController.updateLive);

router.delete("/:id", auth, liveController.deleteLive);

router.get("/count", auth, liveController.countLive);

/* Public */
router.get("/public/all", liveController.publicLive);

module.exports = router;
