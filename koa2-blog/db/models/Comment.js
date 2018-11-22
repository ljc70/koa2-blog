const db = require('../db');

module.exports = db.defineModel('comments', {
	articleId: db.ID, 
	name: db.STRING(100), 
	avator: db.STRING(100), 
	content:db.STRING(1000),
});
