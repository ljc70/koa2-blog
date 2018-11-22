/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";
ApiErrorNames.USER_NOT_EXIST = "userNotExist";
ApiErrorNames.USER_EXIST = "userExist";
ApiErrorNames.REG_FAIL = "regFail";
ApiErrorNames.LOGIN_FAIL = "loginFail";
ApiErrorNames.PARAM_IMPROPER = "paramImproper";
ApiErrorNames.UNAUTHORIZED_ERROR = "unauthorizedError";
ApiErrorNames.VERIFICATION_CODE_ERROR = "verificationCodeError";
ApiErrorNames.UPLOAD_FAIL = "uploadFail";
ApiErrorNames.POST_FAIL = "postFail";
ApiErrorNames.DELETE_FAIL = "deleteFail";
ApiErrorNames.GET_LIST_FAIL = "getListFail";
ApiErrorNames.ARTICLE_NOT_EXIST = "articleNotExist"

/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: -1, message: '未知错误' });
error_map.set(ApiErrorNames.USER_NOT_EXIST, { code: 101, message: '用户不存在' });
error_map.set(ApiErrorNames.USER_EXIST, { code: 2, message: '用户已存在' });
error_map.set(ApiErrorNames.REG_FAIL, { code: 2, message: '注册失败' });
error_map.set(ApiErrorNames.LOGIN_FAIL, { code: 2, message: '用户名或密码错误' });
error_map.set(ApiErrorNames.VERIFICATION_CODE_ERROR, { code: 2, message: '验证码错误' });
error_map.set(ApiErrorNames.UPLOAD_FAIL, { code: 2, message: '上传失败' });
error_map.set(ApiErrorNames.POST_FAIL, { code: 2, message: '发布失败' });
error_map.set(ApiErrorNames.GET_LIST_FAIL, { code: 2, message: '获取列表失败' });
error_map.set(ApiErrorNames.ARTICLE_NOT_EXIST, { code: 2, message: '文章不存在' });
error_map.set(ApiErrorNames.DELETE_FAIL, { code: 2, message: '删除失败' });

error_map.set(ApiErrorNames.PARAM_IMPROPER, { code: 3, message: '参数不合法' });
error_map.set(ApiErrorNames.UNAUTHORIZED_ERROR, { code: 4, message: '未授权，访问被拒绝' });


//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    var error_info;

    if (error_name) {
        error_info = error_map.get(error_name);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!error_info) {
        error_name = UNKNOW_ERROR;
        error_info = error_map.get(error_name);
    }
    
    return error_info;
}

module.exports = ApiErrorNames;