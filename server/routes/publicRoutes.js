const router = require("express").Router();

const newsController = require("../controllers/newsController");
const eventsController = require("../controllers/eventsController");
const ordinanceController = require("../controllers/ordinanceController");
const membersController = require("../controllers/membersController");
const liveController = require("../controllers/liveController");


/*PUBLIC ENDPOINTS*/
router.get("/news", newsController.publicNews);
router.get("/events", eventsController.publicEvents);
router.get("/ordinance", ordinanceController.publicOrdinance);
router.get("/members", membersController.publicMembers);
router.get("/live", liveController.publicLive);

/*SINGLE ITEM VIEW */
router.get("/news/:id", newsController.getSingleNews);
router.get("/ordinance/:id", ordinanceController.getSingleOrdinance);
router.get("/members/:id", membersController.getSingleMember);

module.exports = router;
