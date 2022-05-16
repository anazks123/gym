var express = require('express');
var router = express.Router();
var con=require('../config/config');
/* GET home page. */
router.get('/',(req,res)=>{
res.render('admin/homeIndex')
})
router.get('/login',(req,res)=>{
  res.render('admin/adminlogin')
  })

router.get('/home', function(req, res, next) {
  var sql="select * from product"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log(result)
      res.render('admin/index',{result});
    }
  })

  
});

router.get('/addProduct',function(req,res){
  res.render('admin/addProduct')
})

router.post('/addProduct',function(req,res){
var image_name;
if(!req.files) return res.status(400).send("no files were uploaded.");

var file=req.files.uploaded_image;
var image_name = file.name;
let sql="INSERT INTO product SET ?";

console.log(file)
console.log(image_name);
if(file.mimetype =="image/jpeg" || file.mimetype =="image/png" || file.mimetype =="image/gif"
){
  file.mv("public/images/product/"+file.name,function(err){
    if(err) return res.status(500).send(err);
    console.log(image_name);
    console.log(req.body)
    var cata = req.body.catagory;

let data={
 
  Product_name:req.body.name,
  Description:req.body.description,
  Price:req.body.price,
  Image:image_name,
}; 
console.log(data)
con.query(sql,data,(err,result)=>{
  if(err){
    console.log(err)
  }else{
    res.redirect('/home')
  }
})
}) 
} 
})
router.get('/sellers',(req,res)=>{
  sql = "select * from seller"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
  }else{
    console.log(result)
    res.render('admin/sellers',{seller:result,homepage:true})
  }
  })
})


router.get('/userlist',(req,res)=>{
  sql = "select * from user"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
  }else{
    console.log(result)
    res.render('admin/user',{user:result,homepage:true})
  }
  })
})

router.get('/Blocke_sellers',(req,res)=>{
  sql = "select * from seller where status = 'blocked'"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
  }else{
    console.log(result)
    res.render('admin/blocked',{seller:result,homepage:true})
  }
  })
})
router.get('/block/:id',(req,res)=>{
  var id = req.params.id;
  sql = "update seller set status = 'blocked' where id = ?"
  con.query(sql,[id],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.render('admin/blocked')
    }
  })
})

router.get('/unblock/:id',(req,res)=>{
  var id = req.params.id;
  sql = "update seller set status = '1' where id = ?"
  con.query(sql,[id],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/home')
    }
  })
})



router.post('/adminlog',(req,res)=>{
 var username  = req.body.name;
 var pass  = req.body.pass;
 var sql="select * from trainer where weight = ? and height = ?"
 con.query(sql,[username,pass],(err,row)=>{
   if(err){
     console.log(err)
   }else{
     if(row.length>0){
      res.redirect('/home')
     }else{
      res.render('admin/adminlogin',{data:true})
     }
  
   }
 })

})



router.get('/delete/:id',(req,res)=>{
  var id = req.params.id;
  sql = "Delete from product where id = ?"
  con.query(sql,[id],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/home')
    }
  })
})


router.get('/log/:id',(req,res)=>{
  var id = req.params.id;
  var date =  new Date()
  var data = {
    mid:id,
    date
  }
  sql = "insert into log set ?"
  con.query(sql,data,(err,result)=>{
    if(err){
      console.log(err)
    }else{
      var sql2= "update product set status = 'online' where height = ? "
      con.query(sql2,[id],(err,row)=>{
        if(err){
          console.log(err)
        }else{
          res.redirect('/home')
        }
      })
   
    }
  })
})


router.get('/logOut/:id',(req,res)=>{
  var id  = req.params.id;
var sql2= "update product set status = 'offline' where height = ? "
      con.query(sql2,[id],(err,row)=>{
        if(err){
          console.log(err)
        }else{
          res.redirect('/home')
        }
      })
})



router.get('/logs',(req,res)=>{
  
  sql = "Select * from log"
  con.query(sql,(err,result)=>{
    if(err){
      console.log(err)
    }else{
      console.log(result,"dtlogggggggggggggggggg")
      res.render('admin/sellers',{result})
    }
  })
})
module.exports = router;

