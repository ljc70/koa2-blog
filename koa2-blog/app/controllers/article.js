const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

const model = require('../../db/model');
const Article = model.Article;
const Comment = model.Comment;
const Reply = model.Reply;

Article.hasMany(Comment,{ foreignKey: 'articleId' })
Comment.hasMany(Reply)

//获取文章列表 
exports.findArticle = async (ctx, next) => {
	let countPerPage = parseInt(ctx.query.countPerPage) || 10;
	let currentPage = parseInt(ctx.query.currentPage) || 1;
	let type = ctx.query.type;
	let data
	if(type!=undefined){
		data={
			where:{
				type: {
		            '$like': '%'+type+'%'
		        }
			},
			order: [['createdAt', 'DESC']],
			limit: countPerPage,                      // 每页多少条
			offset: countPerPage * (currentPage - 1)  // 跳过多少条
		}
	}else{
		data={
			order: [['createdAt', 'DESC']],
			limit: countPerPage,                      
			offset: countPerPage * (currentPage - 1)  
		}	
	}
	const list = await Article.findAndCountAll(data)
	.then((res) => {
		let result = {};
	    result.list = res.rows;
	    result.totalCount = res.count;
	    return result;
	}).catch(err => {
		throw new ApiError(ApiErrorNames.GET_LIST_FAIL);
	});
    ctx.body = list;
}

//阅读量排序
exports.readingList = async (ctx, next) => {
	var list = await Article.findAll({
		order: [['pv', 'DESC']], //ASC
		limit: 5
	}).then(res => {
		ctx.body = res;
	}).catch(err => {
		throw new ApiError(ApiErrorNames.GET_LIST_FAIL);
	})
    
}

//热门度排序
exports.hotList = async (ctx, next) => {
	var list = await Article.findAll({
		order: [['likes', 'DESC']], //ASC
		limit: 5
	}).then(res => {
		ctx.body = res;
	}).catch(err => {
		throw new ApiError(ApiErrorNames.GET_LIST_FAIL);
	})
}

//文章详情
exports.detail = async (ctx, next) => {
	const id = parseInt(ctx.query.id);
	const article = await Article.findByPk(id);

	let res_pv,before,after
	if(article == null){
		throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST);
	}else{
		res_pv=article.pv;
		res_pv++;
		article.pv=res_pv;
		await article.save();
		const beforeArt = await Article.findByPk(id-1);
		const afterArt = await Article.findByPk(id+1);
		if(beforeArt){
			before = {
				aId:beforeArt.aId,
				title:beforeArt.title
			}
		}
		if(afterArt){
			after = {
				aId:afterArt.aId,
				title:afterArt.title
			}
		}
		ctx.body = {
			now:article,
			before,
			after
		};
	}
}

//喜欢文章
exports.like = async (ctx, next) => {
	const id = ctx.request.body.id;
	const result= await Article.findByPk(id);
	//let res_likes
    if(result == null){
    	throw new ApiError(ApiErrorNames.ARTICLE_NOT_EXIST);
    }else{
    	result.likes+=1;
    	result.save();
    }
}


//评论列表
exports.commentList = async (ctx, next) => {
	let countPerPage = parseInt(ctx.query.countPerPage) || 10;
	let currentPage = parseInt(ctx.query.currentPage) || 1;
	const id = ctx.query.id;
	let include = [{
		  model: Reply,
		  attributes:{exclude:['updatedAt','version']},

		}]; 
	let one = await Comment.findAndCountAll({
		where:{articleId: id}, 
		include: include,
		limit: countPerPage,                      
		offset: countPerPage * (currentPage - 1),
		order: [['createdAt', 'DESC']],
		distinct: true,
	})

	ctx.body = one;
	
}
