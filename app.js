if (process.env.NODE_ENV != 'development') {
    require('dotenv').config()
}
const express = require('express');
const cors = require('cors');
const { sequelize, Photos, Caption, User } = require('./models');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const flash = require('express-flash');
//const { midWare, del } = require('./middleware/cacheMidware');
const captionsRouter = require("./routes/captionRouter");
const photoRouter = require("./routes/photoRouter");
const userRouter = require("./routes/userRouter");
const passport = require('passport');
const initializePassport = require('./config/passportConfig');
//const Redis = require('redis');
initializePassport(passport);
//const { hashPassword } = require('./middleware/authMiddleware')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);

const PORT = process.env.PORT || 5000;
const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Photo Caption Contest",
            description: "Post a caption under a photo!",
            contact: {
                name: "John Petersen"
            },
            servers: ["http://localhost:5000"]
        }
    },
    //['.routes/*.js']
    apis: [ './models/photo.js',
    './models/user.js',
    './models/caption.js', './routes/captionRouter.js',
    './routes/userRouter.js', './routes/photoRouter.js', 'app.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https: data:"]
      }
    })
)
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'views')));
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use("/captions", captionsRouter);
app.use("/photos", photoRouter);
app.use("/users", userRouter);

app.get("/", (req, res, next) => {
    res.render("index");
});



app.get('/', (req, res, next) =>{
    res.sendFile(__dirname + "/views/index");
})

app.listen({ port: PORT }, async () => {
    console.log(`server YO YO up on ${PORT}`);
    await sequelize.authenticate();
    console.log('database connected');
})
