const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const crypto = require('crypto');
const fs = require('fs');

const model = require('../../db/model');

const User = model.User;
User.sync({alter: true});
const Article = model.Article;
const Comment = model.Comment;
const Reply = model.Reply;

//用户注册
exports.registerUser = async (ctx, next) => {
	const data = ctx.request.body;
	const nickReg = /^[\u4e00-\u9fa5A-Za-z0-9-_]*$/;
	const passwdReg = /^[a-zA-Z0-9]{6,18}$/;
	const usrReg = /^[a-zA-Z0-9]{4,18}$/;
	if(!nickReg.test(data.nickname) || !passwdReg.test(data.passwd) || !usrReg.test(data.name)){
		throw new ApiError(ApiErrorNames.PARAM_IMPROPER);
	}
    const checkUser = await User.findOne({
    	where: {
    		 '$or': [
	            { name: data.name },
	            { nickname: data.nickname }
	        ]
    	}
    })
    if(checkUser !== null){
        throw new ApiError(ApiErrorNames.USER_EXIST);
    }else{    	
        let base64Data = data.avator.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer.from(base64Data, 'base64');
        let getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now()
        await fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => { 
            if (err) throw new ApiError(ApiErrorNames.UPLOAD_FAIL);
            //console.log('头像上传成功') 
        });

        const passwd = crypto.createHash('md5').update(data.passwd).digest('hex');
        //console.log(passwd)
        const user = await User.create({
	        name: data.name,
	        passwd: passwd,
	        nickname: data.nickname,
	        avator: getName,
	    });
	    if( user !== null ){
	    	const token = jwt.sign({
	            name: user.nickname,
	            id: user.id,
	            avator:user.avator
	        }, 'my_token', { expiresIn: 60*60*24 });
	        ctx.body={
	        	name:user.name,
	        	nickname:user.nickname,
	        	id:user.id,
	        	avator:user.avator,
	        	token:token
	        }
	    }else{
	    	throw new ApiError(ApiErrorNames.REG_FAIL);
	    }

    } 
}

//用户登录
exports.login = async (ctx, next) => {
	const cap = ctx.cookies.get('captcha');
	const data = ctx.request.body;
	if(cap!=data.code){
		throw new ApiError(ApiErrorNames.VERIFICATION_CODE_ERROR);
	}
	const passwd = crypto.createHash('md5').update(data.passwd).digest('hex');
	if(!data.name || !data.passwd){
        throw new ApiError(ApiErrorNames.PARAM_IMPROPER);
    }

    const result = await User.findOne({
    	where: {
    		'name': data.name,
    		'passwd': passwd
    	}
    })

    if(result !== null){
        const token = jwt.sign({
            name: result.nickname,
            id: result.id,
            avator:result.avator
        }, 'my_token', { expiresIn: 60*60*24 });
        ctx.body={
        	name:result.name,
        	nickname:result.nickname,
        	id:result.id,
        	avator:result.avator,
        	token:token
        }
    }else{
        throw new ApiError(ApiErrorNames.LOGIN_FAIL);
    }
}

//获取用户
exports.getUser = async (ctx, next) => {
	let data=ctx.state.user;
	const result = await User.findOne({
    	where: {
    		'id': data.id
    	}
    })
    ctx.body={
    	name:result.name,
    	nickname:result.nickname,
    	id:result.id,
    	avator:result.avator,
    }
}

//新建文章
exports.writeArticle = async (ctx , next) => {
	let user = ctx.state.user;
	let data = ctx.request.body;
	//console.log(JSON.stringify(data))
	if(!data.type || !data.title || !data.content || !data.description || !data.desImg){
        throw new ApiError(ApiErrorNames.PARAM_IMPROPER);
    }

	const article = await Article.create({
		userId:user.id,
		nickname:user.name,
		avator:user.avator,
		type:data.type,
		title:data.title,
		content:data.content,
		description:data.description,
		desImg:data.desImg,
	});
	//console.log(JSON.stringify(article))
	if( user !== null ){
    	ctx.body = article;
    }else{
    	throw new ApiError(ApiErrorNames.POST_FAIL);
    }
}

//发表评论 
exports.writeComment = async (ctx , next) => {
	let user = ctx.state.user;
	let data = ctx.request.body;

	if(!data.articleId || !data.content){
        throw new ApiError(ApiErrorNames.PARAM_IMPROPER);
    }

    let newContent = data.content.replace(/[<">']/g, (target) => {
        return {
            '<': '&lt;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
        }[target]
    });

	const comment = await Comment.create({
		name:user.name,
		avator:user.avator,
		articleId:data.articleId,
		content:newContent
	});
	
	if( comment !== null ){
    	ctx.body = comment;
    }else{
    	throw new ApiError(ApiErrorNames.POST_FAIL);
    }
}

//删除评论 
exports.deleteComment = async (ctx , next) => {
	let id = ctx.request.body.id;

	const result= await Comment.destroy({
        where: {
            id: id
        }
    });
    if(result<=0){
    	throw new ApiError(ApiErrorNames.DELETE_FAIL);
    }
}

//发表回复
exports.writeReply = async (ctx , next) => {
	let user = ctx.state.user;
	let data = ctx.request.body;

	if(!data.commentId || !data.content){
        throw new ApiError(ApiErrorNames.PARAM_IMPROPER);
    }

    let newContent = data.content.replace(/[<">']/g, (target) => {
        return {
            '<': '&lt;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
        }[target]
    });

	const reply = await Reply.create({
		reply_name:user.name,
		reply_avator:user.avator,
		commentId:data.commentId,
		content:newContent,
		to_name:data.to_name,
		to_avator:data.to_avator
	});
	
	if( reply !== null ){
    	ctx.body = reply;
    }else{
    	throw new ApiError(ApiErrorNames.POST_FAIL);
    }
}

//删除回复
exports.deleteReply = async (ctx , next) => {
	let id = ctx.request.body.id;

	const result= await Reply.destroy({
        where: {
            id: id
        }
    });
    if(result<=0){
    	throw new ApiError(ApiErrorNames.DELETE_FAIL);
    }
}
