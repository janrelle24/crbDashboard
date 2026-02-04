const router = require("express").Router();
const ordinanceController = require("../controllers/ordinanceController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/", auth, ordinanceController.createOrdinance);
router.get("/", auth, ordinanceController.getOrdinances);

router.delete("/:id", auth, ordinanceController.deleteOrdinance);

router.get("/count", auth, ordinanceController.countOrdinance);

/* Public */
router.get("/public/all", ordinanceController.publicOrdinance);

module.exports = router;
