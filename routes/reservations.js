var express = require('express');
var reservationsDal = require('../core/data/reservations.js');
var usersDal = require('../core/data/users.js');

var router = express.Router();

router.get('/', function (req, res) {
    
    usersDal.listAll(function (allUsers) { 
    
        res.render('reservations', {
            title: 'Reservations', 
            currentPage : 'reservations' ,
            users : allUsers
        });

    });

});

// Ajax
router.get('/calendar', function (req, res) {
    
    var start = req.query.start;
    var end = req.query.end;
    
    reservationsDal.listByDateRange(start, end, function (reservations) {
        
        convertReservationsToCalendarEvents(reservations, function (calendarEvents) { 
            res.json(calendarEvents);
        });

    });

});

router.post('/save', function (req, res) {
    
    var reservation = req.body;

    reservationsDal.save(reservation, function (savedReservation) { 
        res.json(savedReservation);
    });

});

function convertReservationsToCalendarEvents(reservations, callback) {
    
    usersDal.getAssociativeArray(function (userLookup) {
            
        var calendarEvents = [];

        for (var i = 0; i < reservations.length; i++) {
                
            var reservation = reservations[i];
                
            calendarEvents.push({
                id : reservation.id,
                reservation : reservation ,
                title: userLookup[reservation.user_id].getFullName(),
                allDay: true,
                start: getCalendarEventDateString(reservation.start_date),
                end: getCalendarEventDateString(reservation.end_date)
            });

        }

        callback(calendarEvents);
        
    });

}

function getCalendarEventDateString(date) {
    
    var yearString = date.getFullYear().toString();

    var monthString = (date.getMonth() + 1).toString();
    if (monthString.length == 1) { 
        monthString = '0' + monthString;
    }
    
    var dayString = date.getDate().toString();
    if (dayString.length == 1) { 
        dayString = '0' + dayString;
    }

    return yearString + '-' + monthString + '-' + dayString;

}

module.exports = router;