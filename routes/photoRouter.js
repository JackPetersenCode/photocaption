const express = require('express');
const router = express.Router();
const { sequelize, Photos, Caption, User } = require('../models');

const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);



/**
 * @swagger
 * /photos:
 *  get:
 *      description: Use to request all photos
 *      responses:
 *          '200':
 *             description: A successful response
 * 
 */
router.get('/', async (req, res) => {
    console.log('fdkjsjakjfdksjkafjkdjskajfkdjsakfjdjskafjkdjsakfjdksajfkdjsakfjdksaj');
    try {
        let cachedPhotos = await redisClient.get("photos");
        console.log(cachedPhotos);
        return res.json(JSON.parse(cachedPhotos))
    } catch(err) {
            try {
                console.log('im inside the try block');
                const photos = await Photos.findAll({
                    include: ['captions']
                });
                redisClient.set('photos', JSON.stringify(photos));
                return res.json(photos);
            } catch(err) {
                console.log(err)
                return res.status(500).json({error: 'something went wrong'})
            }
        }
}),

/**
 * @swagger
 * /photos/{uuid}:
 *    get:
 *      summary: Get an individual photo with captions
 *      produces:
 *        - application/json
 *      tags:
 *        - Photos
 *      security:
 *        - ApiKeyAuth: []
 *      parameters:
 *        - name: uuid
 *          description: photo uuid
 *          in: path
 *          type: string
 *          required: true
 *          example: "b3775a6e-c1c5-4dd1-8499-cd82048af409"
 *      responses:
 *        "200":
 *          description: returns a photo with its captions
 *        "404":
 *          description: Photo not found
 */
router.get('/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const photo = await Photos.findOne({
            where: { uuid },
            include: ['captions']
        })
        return res.json(photo);
    } catch(err) {
        console.log(err)
        return res.status(500).json({error: 'something went wrong'})
    }
})

/**
 * @swagger
 * /photos:
 *    post:
 *      summary: Creates a new photo
 *      produces:
 *        - application/json
 *      tags:
 *        - Photos
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *        description: Data for new photo
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: 
 *                  object
 *              properties:
 *                  name: 
 *                      type: string
 *                  url:
 *                      type: string
 *      responses:
 *        "201":
 *          description: returns created photo
 *          schema:
 *            type: 
 *                object
 *            properties:
 *                name: 
 *                  type: string
 *                url: 
 *                  type: string
 */
router.post('/', async(req, res) => {
    const { name, url } = req.body;
    console.log(req.body);
    console.log(name)
    console.log(url);
    try {
        const photo = await Photos.create({ name, url });
        console.log(photo);
        return res.json(photo);
    } catch(err) {
        console.log(err);
        return res.status(500).json(err);
    }
})

module.exports = router;