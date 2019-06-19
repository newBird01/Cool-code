var request = require('request');
var cheerio = require('cheerio');
var gm = require('gm');//一定要加imageMagick: true，否则会报错
var fs = require('fs');
var needAnalysis = fs.readFileSync('../需要爬取的商品地址.json','utf8');
needAnalysis = JSON.parse(needAnalysis);

var options = {
    url:'',
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.6726.400 QQBrowser/10.2.2265.400',
        'upgrade-insecure-requests':1,
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'max-age=0',
        // 'cookie': 't=c905e6f8ff3f1ebf0eb42ecd244f1898xx; _tb_token_=xx3a91737e63ea3; cookie2=xx147cd4526b22043d7d6b1af7f1d1f799; cna=xxRJAvFE9e4BkCAZ16OSZaLITT; pnm_cku822=098%23E1hvlQxxvUvbpvUvCkvvvvvjiPPsSwzjnmn2svgjYHPmPygj3Rn2MhtjinR2LwAjYWiQhvCvvv9UUtvpvhvvvvvvGCvvpvvPMMvphvC9vhvvCvpvyCvhQvuZvvC0kDyO2vSdtIjbmYSW94P5CXqU5EDfmlJ1kHsX7veEDT7t5xKO6TrmYCInVQSXoYW6oD6O03HbaihI0HsXZpVjIUDajxALwpKphv8vvvv2Evpvvvvvm2phCv2bUvvUnvphvpgvvv96CvpCCvvvm2phCv2b8EvpvVmvvC9jXHuphvmvvv92n8G5Mc; cq=ccp%3D1; isg=xxBI2N0Xl96sQZXU7onca5XJTHiamre-H2SdppS88S4iSTxq14lrjqDflcNBoFBtn0'
    }
}
needAnalysis.forEach(v=>{
    options.url = v.url;
    var dirname = `../${v.dirname}`;
    if(!fs.existsSync(dirname)){
        fs.mkdirSync(dirname)
    }
    if(!options.url) return;
    request.get(options,function (error, response, body) {
        if(error){
            console.log('获取图片失败');
        }
        const $ = cheerio.load(body);
        var html = $('.nav-tabs').find('li');
        var imgs = [];
        Array.from(html).map(v=>{
            var str = v && v.attribs && v.attribs['data-imgs'] || JSON.stringify({original:''});
            var original = JSON.parse(str).original
            if(original){
                imgs.push( original)
            }
        })
        imgs.forEach(v=>{
            var lastindex = v.lastIndexOf('/');
            var filename = v.slice(lastindex+1);
            var targetFile = `${dirname}/${filename}`;
            gm(request(v))
            .resize(1001, 1001)
            .write(targetFile, function (err) {
                if (!err) console.log('图片修改完成');
            });
        })
      });
})


