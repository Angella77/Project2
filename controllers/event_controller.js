const express = require("express");
const router = express.Router();


var isAuthenticated = require('../config/middleware/isAuthenticated');

const db = require("../models");

router.get("/", function(req,res) {
    db.Event.findAll({}).then(function(data) {
        res.render("index", { parties: data });
    });
});

router.get("/create", function(req,res) {
    db.Event.findAll({}).then(function(data) { 
        res.render("create", data);
    });
});

//RSVP Page/////////////////////////////////////
router.get("/rsvp/:id/:password?", function(req,res) {
    db.Event.findOne({
        where: {
            id: req.params.id
        },
        include: [
            db.Request
        ]
    }).then(function(data) {
        if (req.params.password != null && req.params.password == data.dataValues.creatorPassword) {
            data.dataValues.isCreator = true
        }
        //console.log(data);
        res.render("rsvp", data);
    });
});

//////////////////////////////////////////////////////////////////////////////////////
router.get("/finalize/:id", isAuthenticated, function(req,res) {
    db.Request.findAll({
        where: {
            EventId: req.params.id
        }
    }).then(function(data) {
        console.log('datastart', data, 'dataend');
        res.render('finalize', {request:data});
    });
});


//////////////////////////////////////////////////////////////////////////////////////

router.get("/claim", function(req,res) {
    db.Event.findAll({}).then(function(data) { 
        
        res.render("claim", data);
    });
});

router.get("/:name", function(req,res) {
    db.Event.findOne({
        where: {
            name: req.params.name
        }
    }).then(function(data) {
        //console.log(data);
        res.json(data);
    });
});

router.post("/api/event", function(req,res) {
    //console.log(req.body)
    db.Event.create(req.body).then(function(dbEvent) {
        res.json(dbEvent);
    });
});

router.put("/api/event/:id", function(req, res) {
    db.Event.update(req.body,
        {
            where: {
                id: req.params.id
            }
        }).then(function(result) {
            if (result.changedRows == 0) {
                return res.status(404).end();
            } else {
                res.status(200).end();
            }
        });
});

router.delete("/api/event/:id", function(req,res) {
    db.Event.destroy(req.body,
        {
            where: {
                id: req.params.id
            }
        }).then(function(result) {
            if (result.changedRows == 0) {
                return res.status(404).end();
            } else {
                res.status(200).end();
            }
        });
});

module.exports = router;

