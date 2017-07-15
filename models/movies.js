module.exports = function(sequelize, DataTypes){
	var Movie = sequelize.define("Movie", {
		title: {
			type: DataTypes.STRING,
		},
		category: {
			type: DataTypes.STRING,
		},

		notes: {
			type: DataTypes.STRING,
		},
		imdb_id: {
			type: DataTypes.STRING,
		}, 
		poster: {
			type: DataTypes.STRING,
		}

	},
	    {
      // We're saying that we want our Author to have Posts
      classMethods: {
        associate: function(models) {
          // An Author (foreignKey) is required or a Post can't be made
          Movie.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }



	);
	return Movie;
}