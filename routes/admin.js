const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const {JWT_PASS} = require("../key");
const zod = require("zod");
// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic

    const username = req.headers.username;
    const password= req.headers.password;
    const result = zod
      .object({
        username: zod.string().min(1),
        password: zod.string().min(1),
      })
      .safeParse({ username, password });
    if(result.success){
        await Admin.create({
          username,
          password,
        });
        res.json({ message: "Admin created successfully"});
    }else{
        res.json({ message: "Admin required field not met" });

    }
    
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    try{
    const username = req.headers.username;
    const password = req.headers.password;
    const admin = await Admin.findOne({
        username,
        password
    })
    if(admin){
        const token = jwt.sign({username},JWT_PASS)
        res.json({token : token})
    }else{
        res.json({message:"admin not found"})
    }}catch(err) {
        console.log(err)
        
    }

});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const result  = zod.object({title : zod.string(),description:zod.string(),price:zod.number()}).safeParse({title,description,price});
    if(result.success){
        await Course.create({
          title,
          description,
          price,
        });
        res.json({message : "course created"})
    }else{
        res.json({message:"please fill required fields"})
    }
    


});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({});
    res.json({courses})
});

module.exports = router;