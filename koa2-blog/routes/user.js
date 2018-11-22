var router = require('koa-router')();
var user_controller = require('../app/controllers/user');

router.prefix('/api/users')

router.get('/getUser', user_controller.getUser);
router.post('/registerUser', user_controller.registerUser);
router.post('/login', user_controller.login);
router.post('/writeArticle', user_controller.writeArticle);
router.post('/writeComment', user_controller.writeComment);
router.post('/writeReply', user_controller.writeReply);
router.post('/deleteComment', user_controller.deleteComment);
router.post('/deleteReply', user_controller.deleteReply);

module.exports = router;
