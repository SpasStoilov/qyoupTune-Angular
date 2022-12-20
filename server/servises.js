const bcrypt = require('bcrypt')
const User = require("./models/user.js")
const Blogs = require("./models/blog.js")
const fs = require("fs/promises");

const saltRounds = 10;

function hashPassword(password){
    return bcrypt.hash(password, saltRounds)
}

function ComparePasswords(passwordEnterd, hashPass) {
    return bcrypt.compare(passwordEnterd, hashPass);
};

function userExist (value, flag="username"){
    if(flag == 'email'){
        return User.findOne({email:value}).collation({locale: 'en', strength: 2})
    }
    if(flag == 'id'){
        return User.findOne({_id:value})
    }
    return User.findOne({username:value}).collation({locale: 'en', strength: 2})
}

function getAllBlogs(){
    return Blogs.find({}).lean() 
}

function createUser(email, username, password){
    return new User({
        email,
        username,
        password
    })
}

function createBlog(newSong){
    return new Blogs({...newSong})
}

function getBlog(id){
    return Blogs.findById(id).lean()
}

function getNoLeanBlog(blogId){
    return Blogs.findOne({_id: blogId})
}

function deleteBlogById(id){
    return Blogs.deleteOne({_id: id})
}

function editBlogById(id, payload){
    return Blogs.findByIdAndUpdate(id, {$set: payload});
}

function getSearchedSongs(genre){
    return Blogs.find({genre:genre})
}

function getAllErrorMsgs(errList){
    let errors = []

    for (let err of errList){
        errors.push(err.msg)
    }
    return errors
}

async function appendImgInStaticUploads(files, Paths) {

    for (let [name, file] of Object.entries(files)){

        console.log("fileName", name)
        const originalName = file.originalFilename;
        const oldPath = file.filepath;

        if (originalName){

            let ID = (Math.random() * (10**20)).toFixed() + '-' + (Math.random() * (10**20)).toFixed() + '-' + (Math.random() * (10**20)).toFixed();
            
            const newPath = './static/useruploads/'+ `ID-${ID}-end$` + originalName;
            const reducedNewPath = 'http://localhost:3000/useruploads/'+ `ID-${ID}-end$` + originalName;
            
            try {
                await fs.copyFile(oldPath, newPath);
                Paths.push(reducedNewPath);
            } catch (err) {
                console.log(err.message);
            };
        };

    };
    
    return Paths
}

function deleteFile (path) {
    return fs.unlink(path);
};
 

module.exports = {
    hashPassword,
    userExist,
    ComparePasswords,
    getAllBlogs,
    createUser,
    createBlog,
    getBlog,
    getNoLeanBlog,
    deleteBlogById,
    editBlogById,
    getSearchedSongs,
    getAllErrorMsgs,
    appendImgInStaticUploads,
    deleteFile
}