const express = require('express');
const router = express.Router();

const       { setUser, validateUser } = require('../middleware');
router.get('/',setUser, validateUser, async (req, res) => {

 return res.redirect("/dashboard")


});
module.exports = router;