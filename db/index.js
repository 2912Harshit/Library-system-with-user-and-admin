const mongoose = require('mongoose');
const { number } = require('zod');

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://Harshit:clowny_29@cluster0.c691vy7.mongodb.net/user_app_auth"
);

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username :String,
    password :String,
});

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
  purchasedCourses : [{
    type : mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    description : String,
    price: Number

});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}