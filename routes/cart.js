module.exports=function(app){
    app.get('/cart',function(req,res){
        var Cart=global.dbHelper.getModel('cart');
        if(!req.session.user){
            req.session.error = "用户已过期，请重新登录:";
            res.redirect('/login');
        }else{
            Cart.find({"uId":req.session.user._id,"cStatus":false},function(error,docs){
                res.render('cart',{carts:docs});
            });
        }

    });

    app.get('/addToCart/:id',function(req,res){
        if(!req.session.user){
            req.session.error = "用户已过期，请重新登录:"
            res.redirect('/login');
        }else{
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');

            //商品存在
            Cart.findOne({"uId":req.session.user._id, "cId":req.params.id},function(error,docs){
                if(docs){
                    Cart.update({"uId":req.session.user._id, "cId":req.params.id},{$set : { cQuantity : docs.cQuantity + 1 }},function(error,docs){
                        if(docs>0){
                            res.render('/home');
                        }
                    })
                }else{
                   //商品不存在
                   Commodity.findOne({"_id": req.params.id},function(error,docs){
                       if(docs){
                           Cart.create({
                               uId: req.session.user._id,
                               cId: req.params.id,
                               cName: docs.name,
                               cPrice: docs.price,
                               cImgSrc: docs.imgSrc,
                               cQuantity : 1
                           },function(error,docs){
                               if(docs){
                                   res.redirect('/home');
                               }
                           });
                       }else{

                       }
                   })
                }
            })
        }
    })
};