var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET index page. */
router.get('/', function (req, res, next) {
    res.render('index');
});



router.route("/register")
    /* GET register page. */
    .get(function (req, res) {
        res.render("register");
    })
    /* POST register. */
    .post(function (req, res, next) {
        //get user information
        var uname = req.body.uname;
        var upwd = req.body.upwd;
        var loc = req.body.location;
        var firstUser = false;

        //if the user is the first in database
        Users.findOne({}, function (err, doc) {
            if (!doc) {
                firstUser = true;
            }
        })

        Users.findOne({ email: uname }, function (err, doc) {
            //if user exist in database
            if (doc) {
                req.session.error = 'User Exists';
                res.sendStatus(500);
            } else {
                var base64Image;
                //read default user picture, convert to base64 string
                fs.readFile('default.png', 'binary', function (err, original_data) {
                    base64Image = new Buffer(original_data, 'binary').toString('base64');
                    //if user is first in db, role is superAdmin
                    var role;
                    if (firstUser) {
                        role = 'superAdmin';
                    } else {
                        role = 'regular';
                    }

                    //create user in db
                    var user = Users.create({
                        email: uname,
                        password: upwd,
                        description: '',
                        display_name: uname,
                        image: base64Image,
                        role: role,
                        ip: '',
                        device: '',
                        location: loc
                    }
                    , function (err, doc) {
                        //log session informaion
                        req.session.user = doc;
                        req.session.error = "Login success";
                        res.sendStatus(200);
                    })

                });
            }
        });
    });


router.route("/login")
    /* GET login page. */
    .get(function (req, res) {
        res.render("login");
    })
    /* POST login. */
    .post(function (req, res) {
        var uname = req.body.uname;
        Users.findOne({ email: uname }, function (err, doc) {
            //if no user were found
            if (!doc) {
                req.session.error = 'User does not exist';
                res.sendStatus(404);
            } else {
                //if password is not correct
                if (req.body.upwd != doc.password) {
                    req.session.error = "Wrong password";
                    res.sendStatus(404);
                } else {
                    //log session information
                    req.session.user = doc;
                    res.sendStatus(200);
                }
            }
        });
    });

/* GET user home page. */
router.get("/:email/home", function (req, res) {
    Books.find({borrowed: false}, function (err, data) {
        //if not logged in 
        if (!req.session.user) {
            req.session.error = "Please login";
            res.redirect("/login");
        } else {
            res.locals.books = data;
            res.render("home");
        }
    })
});




router.route("/:email/profile")
    /* GET user profile page. */
    .get(function (req, res) {
        //find user 
        Users.findOne({ email: req.params.email }, function (err, doc) {
            //if not logged in 
            if (!req.session.user) {
                req.session.error = "Please login";
                res.redirect("/login");
            } else {
                res.render("profile", {
                    email: doc.email, description: doc.description,
                    display_name: doc.display_name, image: doc.image, role: doc.role
                });
            }
        })

    })
    /* POST user profile. */
   .post(function (req, res) {
       var display_name = req.body.display_name;
       var description = req.body.description;
       //update user profile
       Users.update({ email: req.params.email }, { display_name: display_name, description: description }, function (err, doc) {
           res.sendStatus(200);
       })
   });

/* POST user password. */
router.post("/:email/password", function (req, res) {
    //find user
    Users.findOne({ email: req.params.email }, function (err, doc) {
        if (req.body.current_password != doc.password) {
            res.sendStatus(500);
        } else {
            //update user password
            Users.update({ email: req.params.email }, { password: req.body.new_password }, function (err, doc) {
                res.sendStatus(200);
            })
        }
    })

});

/* POST user admin. */
router.post("/:email/admin", function (req, res) {
    //find user
    Users.findOne({ email: req.params.email }, function (err, doc) {
        //update user role
        Users.update({ email: req.params.email }, { role: 'admin' }, function (err, doc) {
            res.sendStatus(200);
        })

    })

});

/* POST user unadmin. */
router.post("/:email/unadmin", function (req, res) {
    //find user
    Users.findOne({ email: req.params.email }, function (err, doc) {
        //update user role
        Users.update({ email: req.params.email }, { role: 'regular' }, function (err, doc) {
            res.sendStatus(200);
        })

    })

});

/* POST user delete. */
router.post("/:email/delete", function (req, res) {
    //find user
    Users.findOne({ email: req.params.email }, function (err, doc) {
        //remove user
        doc.remove(function () {
            res.sendStatus(200);
        })

    })

});

/* GET user edit page. */
router.get("/:email/edit", function (req, res) {
    //find user
    Users.findOne({ email: req.params.email }, function (err, doc) {
        //if not logged in
        if (!req.session.user) {
            req.session.error = "Please login";
            res.redirect("/login");
        } else {
            if ((req.session.user.role == 'regular' && req.session.user.email != req.params.email) || (req.session.user.role == 'admin' && req.session.user.email != req.params.email && doc.role != 'regular')) {
                res.sendStatus(404);
            } else {
                res.render("edit", {
                    email: doc.email, description: doc.description,
                    display_name: doc.display_name, image: doc.image, role: doc.role
                });
            }
        }
    })

});

/* POST user picture. */
router.post("/:email/picture", multipartMiddleware, function (req, res) {
    //read pictire from tmp path
    fs.readFile(req.files.picture.path, 'binary', function (err, original_data) {
        //convert to base64 string
        var base64Image = new Buffer(original_data, 'binary').toString('base64');
        //find user
        Users.findOne({ email: req.params.email }, function (err, doc) {
            //update user image
            doc.image = base64Image;
            Users.update({ email: req.params.email }, { image: base64Image }, function (err, data) {
                req.session.user = doc;
                res.redirect('/' + req.params.email + '/profile');
            })

        })

    })

});

/* GET user behavior page. */
router.get("/:email/behaviour", function (req, res) {
    Users.findOne({ email: req.params.email }, function (err, doc) {
        //if not logged in
        if (!req.session.user) {
            req.session.error = "Please login";
            res.redirect("/login");
        } else {
            res.render("behaviour", {
                ip: doc.ip, device: doc.device, location: doc.location
            });
        }
    })

});

/* GET logout. */
router.get("/logout", function (req, res) {
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});


router.route("/:email/share")
    /* GET user share page. */
    .get(function (req, res) {
        //find user 
        Users.findOne({ email: req.params.email }, function (err, doc) {
            //if not logged in 
            if (!req.session.user) {
                req.session.error = "Please login";
                res.redirect("/login");
            } else {
                res.render("share");
            }
        })

    })
    /* POST user share. */
   .post(function (req, res) {
       var title = req.body.title;
       var author = req.body.author;
       var description = req.body.description;
       //create book in db
       var book = Books.create({
           owner: req.params.email,
           title: title,
           author: author,
           description: description,
           borrowed: false  
       }
       , function (err, doc) {
           res.sendStatus(200);
       })
   });

























/* GET user books page. */
router.get("/:email/books", function (req, res) {
    Users.findOne({ email: req.params.email }, function (err, doc) {
        //if not logged in
        if (!req.session.user) {
            req.session.error = "Please login";
            res.redirect("/login");
        } else {
            Books.find({ owner: req.params.email }, function (err, doc) {
                res.locals.books = doc;
                res.render("books");
            })
        }
    })
});

/* POST user message. */
router.post("/:email/message", function (req, res) {
    Users.findOne({ email: req.params.email }, function (err, doc) {
        //TODO
    })
});




router.route("/book/:id")
    /* GET book page. */
    .get(function (req, res) {
        Books.findById(req.params.id, function (err, doc) {
            var user_books = req.session.user.books;
            for (var i = 0; i < user_books.length; i++) {
                if (user_books[i].id == req.params.id) {
                    res.local.user_comment = user_books[i].comment;
                    res.local.user_rate=user_books[i].rate
                }
            }
            res.locals.book = doc;
            res.render("book");
        })
    })
    /* POST book. */
   .post(function (req, res) {
       
   });












module.exports = router;



