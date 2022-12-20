const expressSession = require('express-session');
const mongoose = require("mongoose");
const conectionStr = 'mongodb://127.0.0.1:27017/qyoupTune'; //TODO: change DataBaseName


function starDataBase() {

    try {
        mongoose.connect(
            conectionStr, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log('>>> Database conected to Compass')

    } catch (err) {
        console.error('>>> DataBase Not Working:' + err.message);
    };

   //Errors after initial conection:
    const db = mongoose.connection;

    db.on('error', err => {
        console.error('>>> Database error:' + err.message);
    });
    db.on('open', () => {
        console.log('>>> Database conected');
    });
};


function Configs(server, express) {

    starDataBase()

    server.use('/', express.static("/qyoupTune/server/static/"))
    
    server.use(express.json());

    server.use(
        express.urlencoded({ extended: false })
    );

    server.use(expressSession({
        secret: "someKey",
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    }))

};

module.exports = Configs;
