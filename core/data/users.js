var sql = require('mssql');
var db = require('./db.js');
var User = require('../models/user.js');

module.exports = {

    getAssociativeArray : function (callback) {
        
        sql.connect(db.getConfig(), function (err) { 
        
            if (err) {
                console.dir(err);
            } else { 
            
                var request = new sql.Request();
                
                request.execute('usp_users_list_all', function (err, recordSets) { 
                
                    if (err) {
                        console.dir(err);
                    } else {
                        
                        var result = {};

                        for (var i = 0; i < recordSets[0].length; i++) {
                            
                            var user = new User(recordSets[0][i]);

                            result[user.id] = user;

                        }

                        callback(result);

                    }

                });

            }

        })

        sql.on('error', function (err) { 
            console.dir(err);
        });

    },

    listAll : function (callback) {
        
        sql.connect(db.getConfig(), function (err) {
            
            if (err) {
                console.dir(err);
            } else {
                
                var request = new sql.Request();
                
                request.execute('usp_users_list_all', function (err, recordSets) {
                    
                    if (err) {
                        console.dir(err);
                    } else {
                        
                        var result = [];
                        
                        for (var i = 0; i < recordSets[0].length; i++) {
                            
                            var user = new User(recordSets[0][i]);
                            
                            result.push(user);

                        }
                        
                        callback(result);

                    }

                });

            }

        })
        
        sql.on('error', function (err) {
            console.dir(err);
        });

    }

};