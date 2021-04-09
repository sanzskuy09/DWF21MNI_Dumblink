const express = require("express");

const router = express.Router();

const {
  getUser,
  getDetailUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const {
  getMyLink,
  addLink,
  getlinks,
  deleteLink,
  updateCount,
  addLinkNoMulter,
  uploadImageSublinks,
} = require("../controllers/link");

const { registerUser, loginUser, checkAuth } = require("../controllers/auth");
const { authenticated } = require("../middlewares/auth");
const { checkRolePartner } = require("../middlewares/checkRole");
const { uploadFile } = require("../middlewares/upload");

// Users
router.get("/users", getUser);
router.get("/user/:id", authenticated, getDetailUser);
router.patch("/user/:id", authenticated, updateUser);
router.delete("/user/:id", authenticated, deleteUser);

// List Link
router.get("/links", authenticated, getMyLink);
router.get("/link/:uniqueLink", authenticated, getlinks);
router.post("/link", authenticated, uploadFile("imageFile"), addLink);
// router.post("/link", authenticated, addLinkNoMulter);
router.patch("/link/:uniqueLink", authenticated, updateCount);
router.delete("/link/:id", authenticated, deleteLink);

// upload image sublink
router.post(
  "/image-link",
  authenticated,
  uploadFile("imageLink"),
  uploadImageSublinks
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticated, checkAuth);

module.exports = router;
