var express=require('express');
var app=express();
var path=require('path');
var bodyparser=require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var User=require('./models/user');
var seedDB=require('./seeds.js');
var Post=require('./models/post.js');
var Comment=require('./models/comment.js');
var Applicant=require('./models/applicant.js');
var Job=require('./models/job.js');


seedDB();
mongoose.connect("mongodb://localhost/solace", { useNewUrlParser: true , useUnifiedTopology: true });

app.use(express.static(path.join(__dirname, '/public')));
//passport config
app.use(require("express-session")({
	secret:"jai shree ram",
	resave:false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) );
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(bodyparser.urlencoded({extended:true}));

app.get("/blog/:id/comments/new",function(req,res){
	Post.findById(req.params.id,function(err,post){
		if(err)
			console.log(err);
		else
			res.render("comments/new.ejs",{post:post,currentUser:req.user});
	})
})
app.post("/blog/:id/comments",function(req,res){
	Post.findById(req.params.id,function(err,post){
		if(err){
			console.log(err);
			res.redirect("/blog");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					console.log(err);
				else
					{
						post.comments.push(comment);
						post.save();
						res.redirect('/blog/'+post._id);
					}
			});
		}
	});
});

//authroutes
app.get("/register",function(req,res){
	res.render('register.ejs',{currentUser:req.user});
	
})
app.post("/register",function(req,res){
	var newUser= new User({username:req.body.username,email:req.body.email});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
			{
				console.log(err);
				res.redirect('/register');
			}
		else{
			res.redirect('/login');
		}
	});
});

app.get("/login",function(req,res,next){
	res.render("login.ejs",{currentUser:req.user});
});
app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),function(req,res){
	res.redirect('/dash');
});

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/blog')
});


	
app.listen(3000,process.env.IP,function(){
	console.log("server started.");
});
app.get("/blog",function(req,res){

	Post.find({},function(err,allposts){
		if(err)
			console.log(err);
		else
			res.render("blog/index.ejs",{posts:allposts,currentUser:req.user});
	});

	});

app.get("/",function(req,res){
	res.render("landing.ejs",{currentUser:req.user});
});
app.get("/blog/new",function(req,res){
	res.render("blog/new.ejs",{currentUser:req.user});
});




app.post("/blog",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var newpost={name:name,image:image,description:description};
	Post.create(newpost,function(err,newlycreated){
		if(err)
			console.log(err);
		else
			res.redirect("/blog");
	});
	
});
app.get("/blog/:id",function(req,res){
	Post.findById(req.params.id).populate("comments").exec(function(err,foundpost){
		if(err)
			console.log(err);
		else
			{ console.log(foundpost);
			 res.render("blog/show.ejs",{post:foundpost,currentUser:req.user});
			}
			
	});
});

app.get("/jobs",function(req,res){
	res.render('jobs/index.ejs',{currentUser:req.user});
});

app.get("/jobs/new",function(req,res){
	res.render('jobs/new.ejs',{currentUser:req.user})
});

app.post("/jobs",function(req,res){
	var jname=req.body.jname;
	var company=req.body.company;
	var salary=req.body.salary;
	var location=req.body.location;
	var newjob={jname:jname,company:company,salary:salary,location:location};
	Job.create(newjob,function(err,newlycreated){
		if(err)
			console.log(err);
		else{
			console.log(newlycreated);
			res.redirect("/jobs");
			
		}
			
	});
	
});

app.get("/jobs/list",function(req,res){

Job.find({},function(err,alljobs){
		if(err)
			console.log(err);
		else
			res.render("jobs/listed.ejs",{jobs:alljobs,currentUser:req.user});
	});

});
app.get("/jobs/:id/apply",function(req,res){
	Job.findById(req.params.id,function(err,job){
		if(err)
			console.log(err);
		else
			res.render("jobs/apply.ejs",{job:job,currentUser:req.user});
	})
})
app.post("/jobs/:id/applied",function(req,res){
	Job.findById(req.params.id,function(err,job){
		if(err){
			console.log(err);
			res.redirect("/jobs/list");
		}
		else{
			Applicant.create(req.body.applicant,function(err,applicant){
				if(err)
					console.log(err);
				else
					{
						job.applicants.push(applicant);
						job.save();
						console.log(job.applicants)
						res.render('jobs/applied.ejs',{currentUser:req.user})
					}
			});
		}
	});
});
app.get('/dash',function(req,res){
	res.render("dash.ejs",{currentUser:req.user});
});
app.get('/tvshows',function(req,res){
	res.render("tvshow.ejs",{currentUser:req.user})
});
app.get('/fit',function(req,res){
	res.render("fitness/index.ejs",{currentUser:req.user});
});