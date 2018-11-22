const db = require('../db');

module.exports = db.defineModel('replies', {
	commentId: db.ID, 
	reply_name: db.STRING(100), 
	reply_avator: db.STRING(100), 
	content: db.STRING(1000),
    to_name: db.STRING(100),
    to_avator: db.STRING(100),
});
