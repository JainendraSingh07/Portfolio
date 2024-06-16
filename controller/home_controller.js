module.exports.home = function(req ,res){
    console.log(req.cookies);
    res.cookies('user_id',25);
    return res.render('home',{
        tittle : "Home"
    });
}