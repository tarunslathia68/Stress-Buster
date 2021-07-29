var mongoose = require("mongoose");
var Post = require("./models/post.js");
var Comment   = require("./models/comment.js");
var Job=require("./models/job.js");
var Applicant=require('./models/applicant.js');
 
var data = [
    {
        name: "How corona affected me", 
        image: "/assets/3(2).png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "How to stay positive", 
        image: "/assets/4(2).png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "How to vibe out", 
        image: "/assets/1(2).png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all Blog Posts
   Post.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed posts!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few posts
            data.forEach(function(seed){
                Post.create(seed, function(err, post){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a post");
                        //create a comment
                        Comment.create(
                            {
                                text: "Thanks,helped a lot!",
                                author: "Divesh"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    post.comments.push(comment);
                                    post.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
    Job.deleteMany({},function(err){
        if(err)
        console.log(err)
    });

    console.log('removed jobs')
    Applicant.deleteMany({},function(err){
        if(err)
        console.log(err)
    });

    console.log('removed applicants')

    var jobdata=[
        {
            jname: "Carpenter",
          company: "AB Woodworks",
             salary:"Rs 10000/month",
             location:"New Delhi",
        },
        {
            jname: "Electrician",
          company: "BMC",
             salary:"Rs 12000/month",
             location:"Mumbai",
        },
        {
            jname: "Driver",
          company: "None",
             salary:"Rs 10000/month",
             location:"Kanpur",
        }
    ]
    jobdata.forEach(function(seed){
        Job.create(seed, function(err, post){
            if(err){
                console.log(err)
            } else {
                console.log("added a job");
            }
        })});

}
 
module.exports = seedDB;