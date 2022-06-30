const express = require('express');
const router = express.Router();
//const Redis = require('redis');
const { sequelize, Photos, Caption, User } = require('../models');
const passport = require('passport');
const initializePassport = require('../config/passportConfig');
initializePassport(passport);
const bcrypt = require('bcrypt');

const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);

router.get('../script.js.', function(req, res) {
    res.sendFile("C:/Users/jackp/desktop/coding/photocaption/views/script.js");
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('users/login');
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.post('/register', async(req, res) => {
    let { name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({message: 'please enter all fields'})
    }
    if (password.length < 6) {
        errors.push({message: 'password should be atleast 6 characters'})
    }
    if (password != password2) {
        errors.push({message: 'passwords do not match'})
    }
    if (errors.length > 0) {
        res.render('register', { errors });
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        if (await User.findOne({
            where: { email: email }
        })) {
            errors.push({message: 'user with that email already exists!!!'});
            res.render('register', { errors });
        } else {
            try {
                const user = await User.create({ name: name, email: email, password: hashedPassword });
                req.flash('success_msg', "you are now registered, please log in");
                res.redirect("/users/login")
            } catch (err) {
                console.log(err);
                return res.status(500).json(err);
            }
        }    
    }
});

router.get('/dashboard', (req, res) => {
    console.log(req.user);
    res.render("dashboard", { 
        user: req.user.name,
        userUuid: req.user.uuid,
        id: req.user.id
    });
});

/**
 * @swagger
 * /users:
 *    post:
 *      summary: Creates a new user
 *      produces:
 *        - application/json
 *      tags:
 *        - User
 *      requestBody:
 *        description: Data for new user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: 
 *                  object
 *              properties:
 *                  name: 
 *                      type: string
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *        "201":
 *          description: returns created user
 *          schema:
 *            type: 
 *                object
 *            properties:
 *                name: 
 *                  type: string
 *                email: 
 *                  type: string
 *                password:
 *                  type: string
 */
router.post('/', async(req, res) => {
    console.log(req.body.password);
    const name = req.body.name;
    const email = req.body.email;
    const password = await hashPassword(req.body.password);
    if (await User.findOne({
        where: { email: email }
    })) {
        res.send('user with that email already exists!!!');
    } else {
        console.log(password);
        try {
            const user = await User.create({ name, email, password });
            return res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
})

/**
 * @swagger
 * /users:
 *  get:
 *      description: Use to request all users
 *      responses:
 *          '200':
 *             description: A successful response
 * 
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        console.log(users)
        return res.json(users);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * @swagger
 * /users/individual/{uuid}:
 *    get:
 *      summary: Get an individual user
 *      produces:
 *        - application/json
 *      tags:
 *        - User
 *      parameters:
 *        - name: uuid
 *          description: user uuid
 *          in: path
 *          type: string
 *          required: true
 *          example: "3ab88db9-5324-4a8a-8705-50dd2a9b8d93"
 *      responses:
 *        "200":
 *          description: returns a user
 *        "404":
 *          description: user not found
 */
router.get('/individual/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const user = await User.findOne({
            where: { uuid: uuid },
            include: ['captions']
        });
        //set data to redis
        console.log('lllllllllllllllllllllllllllllllllllllll');
        res.json(user);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * @swagger
 * /users/{uuid}:
 *    put:
 *      summary: Updates a user
 *      produces:
 *        - application/json
 *      tags:
 *        - User
 *      security:
 *        - ApiKeyAuth: []
 *      parameters:
 *        - name: uuid
 *          description: user uuid to update
 *          in: path
 *          type: string
 *          required: true
 *          example: "f884d30e-9497-4690-823d-e1c4f2094905" 
 *      requestBody:
 *        description: Updated user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uuid:
 *                  type: string
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *      responses:
 *        "201":
 *          description: returns updated user
 *          schema:
 *            type: object
 *            properties:
 *              uuid:
 *                type: string
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *        "401":
 *          description: User not authenticated
 *        "403":
 *          description: User not authorized to update this user
 *        "404":
 *          description: user not found
 */
router.put('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({where: { uuid }});
        user.name = name;
        user.email = email;
        user.password = password;
        await user.save();

        return res.json(user);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * @swagger
 * /users/{uuid}:
 *    delete:
 *      summary: delete an individual user
 *      produces:
 *        - application/json
 *      tags:
 *        - User
 *      parameters:
 *        - name: uuid
 *          description: user uuid
 *          in: path
 *          type: integer
 *          required: true
 *          example: "9393939gnfde93494"
 *      responses:
 *        "200":
 *          description: returns a successful deletion
 *        "404":
 *          description: user not found
 */
router.delete('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const user = await User.findOne({where: { uuid }});
        await user.destroy();
        return res.json({ message: 'user deleted' });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * @swagger
 * /users/login:
 *    post:
 *      summary: Login to get access to dashboard
 *      produces:
 *        - application/json
 *      tags:
 *        - User
 *      requestBody:
 *        description: User data for new user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: testuser@test.com
 *                password:
 *                  type: string
 *                  example: p@ssw0rd
 *      responses:
 *        "200":
 *          description: logs in user
 *        "401":
 *          description: incorrect username or password
 */

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}))

module.exports = router;