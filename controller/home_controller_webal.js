module.exports.home = function(req, res){
    console.log(req.cookies);   
    return res.render('webal/home', {
        title: "WebAL"
    });
}


// module.exports.home = function(req,res){   
//     return res.render('layout', {
//         title : "WebAL",
//          style: '<link rel="stylesheet" href="/css/layout.css">'
//     });
// }
