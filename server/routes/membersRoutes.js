const router = require("express").Router();
const membersController = require("../controllers/membersController");
const { auth } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

router.post("/", auth, upload.single("image"), membersController.createMember);

router.get("/", auth, membersController.getMembers);

router.delete("/:id", auth, membersController.deleteMember);

router.get("/count", auth, membersController.countMembers);

/* Public */
router.get("/public/all", membersController.publicMembers);

module.exports = router;
