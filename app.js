var express = require('express');
var http = require('http');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');

var pool = mysql.createPool({
    connectionLimit: 100, 
    host:'localhost',
    user:'root',
    password:'envagyok2382',
    database:'AgrovirDB',
    debug: false
});

app.use(bodyParser());
app.use(cors());

app.get('/partners', (req, res)=>{
    pool.query("select Partner.*, Település.Település, Cégforma.Cégforma from Partner left join Település on Partner.TelepülésID=Település.ID left join Cégforma on Partner.CégformaID=Cégforma.ID",function(err,result){
        if(err) {
            res.json({'error': true, 'message': 'Error occurred' + err});
        }
        res.json(result);
   });
});

app.get('/telepulesek', (req, res)=>{
    pool.query("select * from Település",function(err,result){
        if(err) {
            res.json({'error': true, 'message': 'Error occurred' + err});
        }
        res.json(result);
   });
});

app.get('/cegformak', (req, res)=>{
    pool.query("select * from Cégforma", (err,result)=>{
        if(err) {
            res.json({'error': true, 'message': 'Error occurred' + err});
        }
        res.json(result);
   });
});

app.delete('/partners/:id', (req, res)=>{
    pool.query("delete from Partner where ID=" + req.params.id, (err)=>{
        if(err){
            res.json({'error': true, 'message': 'Error occurred' + err});
        }
    });
});

app.get('/partners/:id', (req, res)=>{
    pool.query("select * from Partner where ID=" + req.params.id, (err, result)=>{
        if(err){
            res.json({'error': true, 'message': 'Error occurred' + err});
        }
        res.json(result);
    });
});

app.post('/partners', (req, res) =>{
    pool.query("insert into Partner (Név,CégformaID, Adószám, Cégjegyzékszám,TelepülésID, Cím, Telefonszám, Bankszámlaszám, Megjegyzés) values ('" + req.body.Név + "', (select ID from Cégforma where Cégforma='"+ req.body.Cégforma +"') ,'" + req.body.Adószám + "','" + req.body.Cégjegyzékszám + "', (select ID from Település where Település='"+ req.body.Település +"') ,'" + req.body.Cím + "','" + req.body.Telefonszám + "','" + req.body.Bankszámlaszám + "','" + req.body.Megjegyzés + "')", (err,response)=>{
        if(err){
            res.json({'error': true, 'message': 'Error occurred' + err});
        }else{
            const newRow =  {...req.body, ID: response.insertId};
            res.json(newRow);
        }
    });
}); 

app.put('/partners/:id', (req, res) =>{
    console.log(req.body.nev)
    pool.query("update Partner set Név='" + req.body.nev + "', CégformaID=(select ID from Cégforma where Cégforma='"+ req.body.cegforma +"'), Adószám='" + req.body.adoszam + "', Cégjegyzékszám='" + req.body.cegjegyzekszam + "', TelepülésID=(select ID from Település where Település='"+ req.body.telepules +"'), Cím='" + req.body.cim + "', Telefonszám='" + req.body.telefonszam + "', Bankszámlaszám='" + req.body.bankszamlaszam + "', Megjegyzés='" + req.body.megjegyzes + "'   where ID =" + req.params.id, (err)=>{
        if(err){
            res.json({'error': true, 'message': 'Error occurred' + err});
        }
    });
});

app.post('/telepulesek', (req,res) =>{
    pool.query("insert into Település (Település) values ('" + req.body.telepules + "')", (err, response)=>{
        if(err){
            res.json({'error': true, 'message': 'Error occurred' + err});
        }else{
            const newRow =  {...req.body, ID: response.insertId};
            res.json(newRow);
        }
    })
})

app.post('/cegforma', (req,res) =>{
    pool.query("insert into Cégforma (Cégforma) values ('" + req.body.cegforma + "')", (err, response)=>{
        if(err){
            res.json({'error': true, 'message': 'Error occurred' + err});
        }else{
            const newRow =  {...req.body, ID: response.insertId};
            res.json(newRow);
        }
    })
})


app.listen(8080);