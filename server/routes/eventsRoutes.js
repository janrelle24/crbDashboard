const router = require("express").Router();
const eventsController = require("../controllers/eventsController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/", auth, eventsController.createEvent);
router.get("/", auth, eventsController.getEvents);

router.put("/:id", auth, eventsController.updateEvent);
router.delete("/:id", auth, eventsController.deleteEvent);

router.get("/count", auth, eventsController.countEvents);

/* Public */
router.get("/public/all", eventsController.publicEvents);

module.exports = router;
