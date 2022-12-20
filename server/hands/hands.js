const { validationResult } = require("express-validator");
const services = require("../servises.js")
const formidable = require("formidable")
const jwt = require('jsonwebtoken');

const ALLOWED_FILE_NAME = ['imgUrl', 'song']
const ALLOWED_FILE_GENRE = ['Рок', 'Поп', 'Класика', 'Народно', 'Друго', 'Метъл']
const ALLOWED_FILE_FIELDS = ['title', 'genre', 'contacts']

const secretKey = 'mySecretKeygfhgdoigjspdiakscalsxpasxcposadolws098oiaes8yxuoixZ(*&098';


async function Home(req, res){
    console.log(">>> GET All SONGS:")
    try{
        const blogs = await services.getAllBlogs()
        console.log(blogs)
        res.json(blogs)
    }
    catch (err){
        console.log("Error >>>", {msg: err.message})
        res.status(404)
        res.json({msg: err.message})
    }
}

async function filteredSongs(req, res){
    console.log(">>> GET FIltered SONGS:")
    try{
        
        jwt.verify(req.headers['x-authorization'], secretKey).email
        const blogs = req.query.genre != 'Всички'? await services.getSearchedSongs(req.query.genre): await services.getAllBlogs()
        console.log(blogs)
        res.json(blogs)
    }
    catch (err){
        console.log("Error >>>", {msg: err.message})
        res.status(404)
        res.json({msg: err.message})
    }
}

async function RegisterUser(req, res){
    
    try {
        let errorList = validationResult(req).errors
    
        if (errorList.length != 0){
            const errors = services.getAllErrorMsgs(errorList)
            res.locals.errorsMSG = errors
            console.log("ERROR:", errors)
            throw new Error(errors)
        }

        const hashPass = await services.hashPassword(req.body.password)
        const newUser = services.createUser(req.body.email, req.body.username, hashPass)
        await newUser.save()

        payload = {
            email: req.body.email
        }

        const token = jwt.sign(payload, secretKey, { expiresIn: '2d' });
        
        res.json({token, email: req.body.email})
    }
    catch (err){
        console.log("Error >>>", {msg: err.message})
        res.status(404)
        res.json({msg: err.message})
    }
        
    
    
}

function LoginUser(req, res){

    try {

        let errorList =  validationResult(req).errors
  
        if (errorList.length != 0){
            const errors = services.getAllErrorMsgs(errorList)
            res.locals.errorsMSG = errors
            throw new Error(errors)
        }

        payload = {
            email: req.body.email
        }

        const token = jwt.sign(payload, secretKey, { expiresIn: '2d' });
        
        res.json({token, email: req.body.email})
        
    }
    catch (err){
        console.log("Error >>>", {msg: err.message})
        res.status(404)
        res.json({msg: err.message})
    }
   
}

async function CreateSong (req, res) {

    console.log('x-authorization', req.headers['x-authorization'])
    let formDataClient = new formidable.IncomingForm()
    
    formDataClient.parse(req, (err, fields, files) => {

        console.log('S:>>> Hand CreateSong: ERRORS:', err);
        console.log('S:>>> Hand CreateSong: FIELDS:', fields);
        console.log('S:>>> Hand CreateSong: FILES:', files);
        console.log('S:>>> Hand CreateSong: FILES Keys:', Object.keys(files))

        try {

            if (err){
                throw new Error(err)
            }
            for(let name of ALLOWED_FILE_FIELDS){
                if (Object.keys(fields).indexOf(name) == -1){
                    throw new Error(`${name} is required!`)
                }
            }
            for(let key of Object.keys(fields)){
                if (ALLOWED_FILE_FIELDS.indexOf(key) == -1){
                    throw new Error('Not Allowed Field!')
                }
                if (key == 'genre' && ALLOWED_FILE_GENRE.indexOf(fields[`${key}`]) == -1){
                    throw new Error('Not Allowed Genre!')
                }
            }
            for(let key of Object.keys(files)){

                const originalName = files[`${key}`].originalFilename;
                console.log(originalName)

                if (ALLOWED_FILE_NAME.indexOf(key) == -1){
                    throw new Error('Not Allowed File!')
                }
                if (key =='song' && !originalName.endsWith('.mp3') && !originalName.endsWith('.wav')){
                    throw new Error('Allowed Values: mp3; wav!')
                }
                if (key =='imgUrl' && !originalName.endsWith('.jpg') && !originalName.endsWith('.png')){
                    throw new Error('Allowed Values: jpg; png!')
                }
            }
            if (Object.entries(fields).length == 0 || Object.entries(files).length == 0){
                throw new Error("Files and Fields must not be Empty!")
            }

            async function RecordINDataBase(){

                let email = jwt.verify(req.headers['x-authorization'], secretKey).email
                console.log('Decoded Email', email)
                const userExist = await services.userExist(email, 'email').populate('songs')

                let Paths = []
                Paths = await services.appendImgInStaticUploads(files, Paths)

                console.log("NEW PATHS", Paths)

                let newSong = {
                    title: fields.title,
                    imgUrl: Paths[0],
                    songPath: Paths[1],
                    contacts: fields.contacts,
                    genre: fields.genre,
                }

                let newBlogSong = await services.createBlog(newSong)
                await newBlogSong.save()
                
                userExist.songs.push(newBlogSong)
                await userExist.save()
                
                res.status(200)
                res.json(userExist)
            }
            RecordINDataBase()
        }
        catch (err){
            console.log("Error >>>", {msg: err.message})
            res.status(404)
            res.json({msg: err.message})
        }
    })

}

async function GetUserSongs(req, res){
    console.log('x-authorization', req.headers['x-authorization'])

    try {
       
        let email = jwt.verify(req.headers['x-authorization'], secretKey).email
       
        console.log('Decoded Email', email)
        const userExist = await services.userExist(email, 'email').populate('songs')

        res.json(userExist)
    }
    catch (err){
        console.log("Error >>>", {msg: err.message})
        res.status(404)
        res.json({msg: err.message})
    }
}

async function DeleteSong(req, res){
    console.log('req.query.song', req.query.song)

    const cutStartIndex = ('http://localhost:3000/').length

    try{
        let songToDelte = await services.getBlog(req.query.song)

        let pathImg = songToDelte.imgUrl.slice(cutStartIndex)
        let pathSng = songToDelte.songPath.slice(cutStartIndex)
        await services.deleteFile(`/qyoupTune/server/static/${pathImg}`)
        await services.deleteFile(`/qyoupTune/server/static/${pathSng}`)
      

        await services.deleteBlogById(req.query.song)
        res.json({ok:'Song Deleted!'})
    }
    catch(err){
        console.log("Error >>>", err)
        res.status(404)
        res.json({msg: err.message})
    }
    
}

async function editSong(req, res){

    console.log('req.query.song', req.query.song)
    const cutStartIndex = ('http://localhost:3000/').length
 
    let formDataClient = new formidable.IncomingForm()

    formDataClient.parse(req, (err, fields, files) => {
        console.log('S:>>> Hand CreateSong: ERRORS:', err);
        console.log('S:>>> Hand CreateSong: FIELDS:', fields);
        console.log('S:>>> Hand CreateSong: FILES:', files);
        console.log('S:>>> Hand CreateSong: FILES Keys:', Object.keys(files));
        
        try {

            async function RecordINDataBase(){

                let email = jwt.verify(req.headers['x-authorization'], secretKey).email
                let songToEdit = await services.getBlog(req.query.song)
                console.log('songToEdit', songToEdit)

                //delete filse:
                for(let key of Object.keys(files)){
                    let FIELD = 'imgUrl'
                    if (key == 'song'){
                        FIELD = 'songPath'
                    }
                    if (ALLOWED_FILE_NAME.indexOf(key) == -1){
                        throw new Error('Not Allowed Value!')
                    }
                    let path = songToEdit[FIELD].slice(cutStartIndex)
                    await services.deleteFile(`/qyoupTune/server/static/${path}`)
                }

                let editFields = Object.entries(fields).filter(f => f[1])
                editFields = Object.fromEntries(editFields)

                let Paths = []
                Paths = await services.appendImgInStaticUploads(files, Paths)
                console.log("NEW PATHS", Paths)

                let pathObj = {}
                let allKeysFiles = Object.keys(files)

                for(let i=0; i < Paths.length; i++){
                    let FIELD = 'imgUrl'
                    if (allKeysFiles[i] == 'song'){
                        FIELD = 'songPath'
                    }
                    pathObj[FIELD] = Paths[i]
                }
                
                let updateInfo = {
                    ...editFields,
                    ...pathObj
                }

                await services.editBlogById(req.query.song, updateInfo)
                const userExist = await services.userExist(email, 'email').populate('songs')

                res.status(200)
                res.json(userExist)
            }
            RecordINDataBase()
        }
        catch (err){
            console.log("Error >>>", {msg: err.message})
            res.status(404)
            res.json({msg: err.message})
        }

    })
    
}

async function getSong(req, res){
    
    console.log("GET SONG!")
    console.log('req.query.song', req.query.song)
    try{
        let email = jwt.verify(req.headers['x-authorization'], secretKey).email
        const blog = await services.getBlog(req.query.song)
        console.log(blog)
        res.json(blog)
    }
    catch (err){
        console.log("Error >>>", {msg: err.message})
        res.status(404)
        res.json({msg: err.message})
    }
}

module.exports = {
    Home,
    RegisterUser,
    LoginUser,
    CreateSong,
    GetUserSongs,
    DeleteSong,
    editSong,
    getSong,
    filteredSongs
}
