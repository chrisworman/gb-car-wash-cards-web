function Reservation(o) { 

    const options = o || {};
    
    this.id = options.id;
    this.user_id = options.user_id;
    this.start_date = options.start_date;
    this.end_date = options.end_date;

}

module.exports = Reservation;