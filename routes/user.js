const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_PASS} = require("../key");
const zod = require("zod");

// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const username = req.headers.username;
    const password= req.headers.password;
    const result = zod.object({
        username: zod.string().min(1),
        password: zod.string().min(1)
    }).safeParse({username,password});
    if(result.success){
        await User.create({
          username,
          password,
        });
        res.json({ message: "user created successfully" });
    }else{
        res.json({ message: "user required field not met " });
    }
    
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;

    const user = await User.findOne({
        username,
        password
    })
    if(user){
        const token = jwt.sign({username},JWT_PASS)
        res.json({token : `Bearer user ${token}`})
    }else{
        res.json({message:"user not found"})
    }
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find({});
    res.json({courses})
});

router.post('/courses/:courseId', userMiddleware, async(req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;
    
    await User.updateOne({username},
        {
            "$addToSet":{
                purchasedCourses : courseId
            }
        }
    )
    res.json({
        message:"course purchased"
    })

});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username;
    const user = await User.findOne({ username });
    const courses = await Course.find({
        _id: {
            "$in" : user.purchasedCourses
        }
    })
    res.json({courses})

});

module.exports = router