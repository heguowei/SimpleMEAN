
var CT = require('./modules/country-list');
var PT = require('./modules/profession-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

var fs = require('fs');

var _ = require('underscore');



module.exports = function(app) {

// main login page //

	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/home', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			res.render('home', {
				title : 'Control Panel',
				countries : CT,
                profession: PT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/home', function(req, res){
		if (req.body['user'] != undefined) {
			AM.updateAccount({
				user 	: req.body['user'],
				name 	: req.body['name'],
				email 	: req.body['email'],
				pass	: req.body['pass'],
				country : req.body['country'],
                profession   : req.body['profession']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.status(200).send('ok');
				}
			});
		}	else if (req.body['logout'] == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.status(200).send('ok'); });
		}
	});
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT,  professions: PT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country'],
            profession   : req.body['profession']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	

    app.get('/files/:directory', function(req,res){
     //   FM.getAllRecords( //__dirname,req.params.directory,req.url,function(e, arrFiles){
		//	res.render('files', { title : 'File List', accts : arrFiles });
		//})
        var directory = req.params.directory;
         var arrURL = req.url.split('/');
    var appending = false;
    for (var i = 0, l = arrURL.length; i < l; i++){ // if there are more subdirectories, attempt to append them to the local directory
        if (arrURL[i] === directory){
            appending = true;
            continue;
        }
        if (appending === true){
            directory = directory + '/' + arrURL[i];
        }
    }
    var files;
   
    try {
       
        directory=__dirname+'/'+directory+"/";
         console.info(directory);
        files = fs.readdirSync(directory);
    } catch (err) {
       res.status(400).send('No such directory. Please try again');
      
    }
    
  var arrFiles = [];
    // console.info("files"+files);
    for (var i in files){
        if (!files.hasOwnProperty(i)){
            continue;
        }
        var name = directory + '/' + files[i];
        if (!fs.statSync(name).isDirectory()){
            arrFiles.push(files[i]);
        }     
    }
    
     res.render('files', { title : 'File Name List', accts : arrFiles });
  
    
       
    });
	 
  
            // view & delete accounts //
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
    
    app.get('/listusers', function(req, res) {
      
         var  filters = req.param('query');
         var arr = [];
       
        if(filters==null){
          AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts          });
		}) 
       }
        else{       
         console.info(filters);
      
        var your=JSON.parse(filters);
       
        arr.push(your);
       
          
       //var your=filters;
       //console.info(your);
      //  arr.push(your);
        console.info(arr);
       	AM.getRecordsByFilter(arr,function(e, accounts){
            if(accounts==null){
			 res.status(400).send('record not found'); 
            }
            else{
                res.render('print', { title : 'Account List', accts : accounts
                    });
               
            }
		});
        }
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
	app.get('*', function(req, res) { 
       
        res.render('404', { title: 'Page Not Found'});
    });

};