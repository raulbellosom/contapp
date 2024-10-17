import express from "express";
import {
  login,
  register,
  loadUser,
  logout,
  updatePassword,
  updateProfile,
  updateProfileImage,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload, saveProfileImage } from "../utils/saveProfileImage.js";
import { verifyRole } from "../middleware/authorization.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.route("/me").get(protect, loadUser);
router.put("/updateProfile", protect, updateProfile);
router.put(
  "/updateProfileImage",
  protect,
  upload.single("profileImage"),
  saveProfileImage,
  updateProfileImage
);
router.put("/updatePassword", protect, updatePassword);

export default router;
