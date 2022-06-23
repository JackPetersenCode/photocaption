'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Caption }) {
      // define association here
      this.hasMany(Caption, { foreignKey: 'photoId', as: 'captions' })
    }
    
  }
  Photos.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    tableName: "photos",
    modelName: "Photos"
  });
  console.log(Photos);
  return Photos;
};