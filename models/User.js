const bcrypt = require('bcrypt');

const mongoose = require('../mongoose/mongoose.js');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name required'], lowercase: true },
    email: { type: String, required: [true, 'email required'], unique: true, lowercase: true },
    password: { type: String, required: [true, 'password required'] },
    registered: { type: Date, default: Date.now },
    last_access: { type: Date, default: Date.now },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 }
});

UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        const document = this;
        bcrypt.hash(document.password, 10, function(err, hashedPassword) {
            if (err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        });
    } else {
        next();
    }
});

UserSchema.methods.checkPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);