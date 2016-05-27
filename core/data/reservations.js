var sql = require('mssql');
var db = require('./db.js');
var Reservation = require('../models/reservation.js');

module.exports = {
    
    listByDateRange: function (startDate, endDate, callback) {
        
        sql.connect(db.getConfig(), function (err) { 
        
            if (err) {
                console.dir(err);
            } else { 
            
                var request = new sql.Request();
                
                request.input('start_date', sql.DateTime, new Date(startDate));
                request.input('end_date', sql.DateTime, new Date(endDate));

                request.execute('usp_reservations_list_in_date_range', function (err, recordSets) { 
                
                    if (err) {
                        console.dir(err);
                    } else {
                        
                        var result = [];

                        for (var i = 0; i < recordSets[0].length; i++) {
                            
                            var reservation = new Reservation(recordSets[0][i]);

                            result.push(reservation);

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

    save: function (reservation, callback) { 
    
        sql.connect(db.getConfig(), function (err) {
            
            if (err) {
                console.dir(err);
                callback(null);
            } else {
                
                var request = new sql.Request();
                
                var sprocName = '';
                if (reservation.id > 0) {
                    request.input('id', sql.Int, reservation.id);
                    sprocName = 'usp_reservations_update';
                } else {
                    request.output('id', sql.Int);
                    sprocName = 'usp_reservations_insert';
                }

                request.input('start_date', sql.DateTime, new Date(reservation.start_date));
                request.input('end_date', sql.DateTime, new Date(reservation.end_date));
                request.input('user_id', sql.Int, reservation.user_id);

                request.execute(sprocName, function (err) {
                    
                    if (err) {
                        console.dir(err);
                        callback(null);
                    } else {
                        
                        if (reservation.id <= 0) { 
                            reservation.id = request.parameters.id.value;
                        }
                        
                        callback(reservation);

                    }

                });

            }

        })
        
        sql.on('error', function (err) {
            console.dir(err);
            callback(null);
        });

    }

};