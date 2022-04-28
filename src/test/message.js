require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')
const { ObjectId } = require('mongoose')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})


var SAMPLE_USER_ID = '5a422aa71b54a676234d17f8'
var SAMPLE_MESSAGE_ID = '5a922aa71b64a672234d1ff8'

describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here

        // create a test user
        const testUser = new User({
            username: 'testuser',
            password: 'testpassword',
        })
        SAMPLE_USER_ID = testUser._id
        // save it to the db
        testUser.save()

        // create a mock message
        const message = new Message({
            title: 'test message',
            body: 'test message body',
            author: testUser._id,
        })
        SAMPLE_MESSAGE_ID = message._id
        // save it to the db
        message.save()
        
        done()
    })

    afterEach((done) => {
        // TODO: add any afterEach code here

        // clear the test db
        User.remove({})
        Message.remove({})

        done()
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
            .get('/api/messages')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
            })

        done()
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .get('/api/messages/' + SAMPLE_MESSAGE_ID)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
            })
        done()
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .post('/api/messages')
            .send({
                title: 'test message',
                body: 'test message body',
                author: SAMPLE_USER_ID
            })
                
        done()
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .put('/api/messages/' + SAMPLE_MESSAGE_ID)
            .send({
                title: 'test message',
                body: 'test message body',
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('title')
                res.body.should.have.property('body')
                res.body.title.should.equal('test message')
                res.body.body.should.equal('test message body')
            });

        done()
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .delete('/api/messages/' + SAMPLE_MESSAGE_ID)
            .end((err, res) => {
                res.should.have.status(200)
                // message should be deleted
                Message.findById(SAMPLE_MESSAGE_ID)
                    .then((message) => {
                        assert.isNull(message)
                    });
            })

        done()
    })
})
