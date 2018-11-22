var captchapng = require('captchapng');

exports.captcha = async (ctx, next) => {
	const str = parseInt(Math.random()*9000+1000);   //随机生成数字
	// 存入cookies
    ctx.cookies.set('captcha', str, {maxAge: 360000, httpOnly: true});
    const p = new captchapng(80, 30, str);  //生成尺寸80*30的图片
    //p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    const img = p.getBase64();
    const imgbase64 = new Buffer(img, 'base64');
    ctx.res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    ctx.res.end(imgbase64);
}


