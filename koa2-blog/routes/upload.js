var router = require('koa-router')();
var upload_controller = require('../app/controllers/upload');

router.post('/upload',upload_controller.config.single('file'), upload_controller.upload);

module.exports = router;
