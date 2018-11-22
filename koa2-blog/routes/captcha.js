var router = require('koa-router')();
var captcha_controller = require('../app/controllers/captcha');

router.get('/captcha', captcha_controller.captcha);

module.exports = router;
