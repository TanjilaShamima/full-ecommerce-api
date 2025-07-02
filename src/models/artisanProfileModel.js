const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ArtisanProfile = sequelize.define("ArtisanProfile", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tagLine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  socialMedia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  about: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
});

// ArtisanProfile.hasOne(Story, {
//   foreignKey: "artisanProfileId",
//   as: "story",
// });
// Story.belongsTo(ArtisanProfile, {
//   foreignKey: "artisanProfileId",
//   as: "artisanProfile",
// });

module.exports = ArtisanProfile;
