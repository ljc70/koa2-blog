const db = require('../db');

module.exports = db.defineModel('articles', {
    aId : {
        type: db.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    userId: db.ID, //用户id
    nickname: db.STRING(100), //用户名
    type:db.STRING(100), //文章类型
    avator:db.STRING(100), //用户头像
    title: db.STRING(100), //文章标题
    description: db.TEXT, //描述
    desImg: db.STRING(100), //图片说明
    content: db.TEXT, //文章内容
    pv: { //文章浏览数
    	type: db.INTEGER,
    	defaultValue: 0
    },
    likes: { //喜欢人数
    	type: db.INTEGER,
    	defaultValue: 0
    }
});