var router = require('koa-router')();
var article_controller = require('../app/controllers/article');

router.prefix('/api/article')

router.get('/findArticle', article_controller.findArticle);
router.get('/readingList', article_controller.readingList);
router.get('/hotList', article_controller.hotList);
router.get('/detail', article_controller.detail);
router.get('/commentList', article_controller.commentList);
router.post('/like',article_controller.like)

module.exports = router;
