const { Schema, model} = require('mongoose');


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const Users = new Schema ({
    name: {
        type: String,
        minlength: [2, '(`{PATH}`) `{VALUE}` is shorter than the minimum allowed length (2).'],
        required: true,
    },
    surname: {
        type: String,
        minlength: [3, '(`{PATH}`) `{VALUE}` is shorter than the minimum allowed length (3).'],
        required: true,
    },
    username: {
        type: String,
        required: true,
        minlength: [4, '(`{PATH}`) `{VALUE}` is shorter than the minimum allowed length (4).'],
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true,
        dropDups: true
    },
    role: { 
        type: String, 
        enum: ['client', 'admin'], 
        default: 'client' 
    },
    purchasedBooks: [{ 
        book: {type: Schema.Types.ObjectId, ref: 'Book'},
        purchaseDate: {type: Date, default: Date.now}
    }],
    cart: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    date: {
        type: Date,
        default: Date.now,
    },
    subscription: {
        active: {
            type: Boolean,
            default: false,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    }
})

const UsersModel = model('users', Users);

module.exports = UsersModel