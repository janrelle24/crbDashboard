const router = require("express").Router();

const newsController = require("../controllers/newsController");
const { auth } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

/* Protected News Routes */
router.post("/", auth, upload.single("image"), newsController.createNews);

router.get("/", auth, newsController.getNews);

router.delete("/:id", auth, newsController.deleteNews);

/*Count Route */
router.get("/count", auth, newsController.countNews);

/*Public Route */
router.get("/public/all", newsController.publicNews);

module.exports = router;
