$(document).ready(function () {
    
    

    // Initialize calendar
    $('#calendar').fullCalendar({
        
        dayClick: handleDayClick ,
        
        eventClick: handleEventClick,
        
        events : 'calendar' ,

        header : {
            left : 'title' ,
            center : '' ,
            right: 'today prev,next'
        }

    });
    
    // Initialize popup
    $('#reservationPopup #startDateInput').datepicker();
    $('#reservationPopup #endDateInput').datepicker();
    
    // Initialize reservation button
    $('#addReservationButton').on('click', function () {
        editReservation({
            id : 0 ,
            user_id : 0 ,
            start_date : $('#calendar').fullCalendar('getDate').format() ,
            end_date : $('#calendar').fullCalendar('getDate').add(1, 'days').format()
        });
    });

    function handleDayClick(date) {

        editReservation({
            id : 0 ,
            user_id : 0 ,
            start_date : date.add(1, 'days').format() ,
            end_date : date.add(1, 'days').format()
        });

    }

    function handleEventClick(calendarEvent) {
        editReservation(calendarEvent.reservation);
    }

    function editReservation(reservation) {
        
        $('#reservationPopup #userSelect').val(reservation.user_id);
        $('#reservationPopup #startDateInput').datepicker('setDate', new Date(reservation.start_date));
        $('#reservationPopup #endDateInput').datepicker('setDate', new Date(reservation.end_date));

        // Attach the save button click event handler
        $('#reservationPopup #saveButton').off();
        $('#reservationPopup #saveButton').on('click', function () {
            
            // Update reservation
            reservation.user_id = $('#reservationPopup #userSelect').val();
            reservation.start_date = $('#reservationPopup #startDateInput').datepicker({ dateFormat : 'yyyy-mm-dd' }).val();
            reservation.end_date = $('#reservationPopup #endDateInput').datepicker({dateFormat : 'yyyy-mm-dd'}).val();

            // Save reservation
            $.ajax({
                type: 'post' ,
                url: '/save' ,
                dataType: 'json' ,
                data: reservation ,
                success: function (response) {
                    if (response) {
                        $('#reservationPopup').modal('hide');
                        $('#calendar').fullCalendar('refetchEvents'); 
                    } else { 
                        alert('Error saving reservation');
                    }
                     
                }
            });

        });

        $('#reservationPopup').modal('show');   

    }
    
});