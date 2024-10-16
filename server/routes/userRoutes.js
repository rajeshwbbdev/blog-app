const { Router } = require("express");
const {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors} = require("../Controllers/userController.js")
const router = Router();
const authMiddleWare = require('../Middleware/authMiddleWare.js')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar', authMiddleWare, changeAvatar)
router.patch('/edit-user',authMiddleWare, editUser)

module.exports = router;
