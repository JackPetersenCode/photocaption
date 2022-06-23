const express = require('express');
const router = express.Router();
const { sequelize, Photos, Caption, User } = require('../models');

const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);


router.get('../script.js.', function(req, res) {
    res.sendFile("C:/Users/jackp/desktop/coding/photocaption/views/script.js");
});

/**
 * @swagger
 * /captions:
 *  get:
 *      description: Use to request all captions
 *      responses:
 *          '200':
 *             description: A successful response
 * 
 */
router.get('/', async (req, res) => {
    console.log('PPPPPPPDPSAPFDDPSAPFPDSAPFPDSAPFPDSPAPFDSA');
    let cachedCaptions = await redisClient.get("captions");
    if (cachedCaptions) {
        return res.json(JSON.parse(cachedCaptions))
    } else {
        try {
            const captions = await Caption.findAll({
                include: ['user', 'photo']
            });
            redisClient.set('captions', JSON.stringify(captions));
            return res.json(captions);
        } catch(err) {
            console.log(err)
            return res.status(500).json({error: 'something went wrong'})
        }
    }
})

/**
 * @swagger
 * /captions:
 *    post:
 *      summary: Creates a new caption
 *      produces:
 *        - application/json
 *      tags:
 *        - Caption
 *      requestBody:
 *        description: Data for new caption
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: 
 *                  object
 *              properties:
 *                  userUuid: 
 *                      type: string
 *                      example: "e2400a6e-c1c5-4dd1-8499-cd82048af409"
 *                  photoId: 
 *                      type: integer
 *                      example: "3"
 *                  body: 
 *                      type: string
 *                      example: "this is an example caption"
 *      responses:
 *        "201":
 *          description: returns created caption
 *          schema:
 *            type: 
 *                object
 *            properties:
 *                userUuid: 
 *                  type: string
 *                photoId: 
 *                  type: integer
 *                body: 
 *                  type: string
 */
router.post('/', async (req, res) => {
    const { userUuid, photoId, body } = req.body;
    try {
        const user = await User.findOne({ where: { uuid: userUuid }});
        const photo = await Photos.findOne({ where: { id: photoId }});
        const caption = await Caption.create({ body, userId: user.id, photoId: photo.id });
        console.log(user);
        console.log(photo);
        console.log(caption);
        try {
            const photos = await Photos.findAll({
                include: ['captions']
            });
            redisClient.set('photos', JSON.stringify(photos));
            return res.json(caption);
        } catch(err) {
            console.log(err)
            return res.status(500).json({error: 'something went wrong'})
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

/**
 * @swagger
 * /captions/{id}:
 *    delete:
 *      summary: delete an individual caption
 *      produces:
 *        - application/json
 *      tags:
 *        - Caption
 *      security:
 *        - ApiKeyAuth: []
 *      parameters:
 *        - name: id
 *          description: caption id
 *          in: path
 *          type: integer
 *          required: true
 *          example: "3"
 *      responses:
 *        "200":
 *          description: returns a successful deletion
 *        "404":
 *          description: caption not found
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id)
    console.log('BOOOOOOOOOOOOOOOOOOOOOOOOOOOO')
    const { userUuid, userId, } = req.body;
    try {
        const caption = await Caption.findOne({where: { id }});

        if (caption.userId == userId) {
            await caption.destroy();
            try {
                const photos = await Photos.findAll({
                    include: ['captions']
                });
                redisClient.set('photos', JSON.stringify(photos));
                return res.json('caption deleted from redis');
            } catch(err) {
                console.log(err)
                return res.status(500).json({error: 'something went wrong'})
            }
            //return res.json("caption deleted");
        } else {
            res.send("Error: You do not have access to this quote.");
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong' })
    }
})

/**
 * @swagger
 * /captions/{id}:
 *    put:
 *      summary: Updates a caption's comment
 *      produces:
 *        - application/json
 *      tags:
 *        - Caption
 *      security:
 *        - ApiKeyAuth: []
 *      parameters:
 *        - name: id
 *          description: caption id to update
 *          in: path
 *          type: integer
 *          required: true
 *          example: 1
 *      requestBody:
 *        description: Updated comment
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uuid:
 *                  type: string
 *                  example: "e2488d6e-c1c5-4dd1-8499-cd82048af409"
 *                userId:
 *                  type: integer
 *                  example: 1
 *                body:
 *                  type: string
 *                  example: "This is an AMAZING photo"
 *      responses:
 *        "201":
 *          description: returns updated caption
 *          schema:
 *            type: object
 *            properties:
 *              uuid:
 *                type: string
 *              userId:
 *                type: integer
 *              body:
 *                type: string
 *        "401":
 *          description: User not authenticated
 *        "403":
 *          description: User not authorized to update this caption
 *        "404":
 *          description: caption not found
 */

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    console.log('dkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
    const { userUuid, userId, body } = req.body;
    try {
        const caption = await Caption.findOne({where: { id }});
        console.log(caption.userId);
        console.log(userId);

        if (caption.userId == userId) {
            caption.body = body;
            await caption.save();
            try {
                const photos = await Photos.findAll({
                    include: ['captions']
                });
                redisClient.set('photos', JSON.stringify(photos));
                return res.json('caption updated in redis');
            } catch(err) {
                console.log(err)
                return res.status(500).json({error: 'something went wrong'})
            }
            //return res.json(caption);
        } else {
            res.send("Error: You do not have access to this quote.");
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'something went wrong' })
    }
})

module.exports = router;