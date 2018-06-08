//Require brcypt packaging for hashing out password
var bcrypt = require("bcrypt-nodejs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        // The email cannot be null, and must be a proper email before creation
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // The password cannot be null
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },      // We're saying that we want our Author to have Posts
        {
            classMethods: {
            associate: function(models) {
              // Associating Author with Posts
              // When an Author is deleted, also delete any associated Posts
              User.hasMany(models.Movie, {
                onDelete: "cascade"
              });
            }
        }
    }


    );

    //prototype method/function for User model--comparison check between unhashed password and hashed password in mySQL DB
    User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    }

    //Hook is hashing password before User is created (from Sequelize model)
    User.hook("beforeCreate", function(user, options) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    })

    return User;

};
