function User(o) {
    
    const options = o || {};
    
    this.id = options.id;
    this.user_name = options.user_name;
    this.first_name = options.first_name;
    this.last_name = options.last_name;

}

User.prototype.getFullName = function () { 

    if (this.first_name && this.last_name) {
        return this.first_name + ' ' + this.last_name;
    } else { 
        return null;
    }

};

module.exports = User;