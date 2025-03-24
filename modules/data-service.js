require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

// Create Sequelize connection
let sequelize = new Sequelize(
  process.env.DB_DATABASE, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  }
);

// Define ProvinceOrTerritory model
const ProvinceOrTerritory = sequelize.define('ProvinceOrTerritory', {
  code: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  region: Sequelize.STRING,
  capital: Sequelize.STRING
}, {
  timestamps: false
});

// Define Site model
const Site = sequelize.define('Site', {
  siteId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  site: Sequelize.STRING,
  description: Sequelize.TEXT,
  date: Sequelize.INTEGER,
  dateType: Sequelize.STRING,
  image: Sequelize.STRING,
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  designated: Sequelize.INTEGER,
  provinceOrTerritoryCode: Sequelize.STRING
}, {
  timestamps: false
});

// Create association
Site.belongsTo(ProvinceOrTerritory, {foreignKey: 'provinceOrTerritoryCode'});


function initialize() {
  return sequelize.sync();
}

function getAllSites() {
  return Site.findAll({
    include: [ProvinceOrTerritory]
  });
}

function getSiteById(id) {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: { siteId: id }
  }).then(sites => {
    if (sites.length > 0) {
      return sites[0];
    } else {
      throw new Error("Unable to find requested site");
    }
  });
}

function getSitesByProvinceOrTerritoryName(name) {
  return Site.findAll({
    include: [{
      model: ProvinceOrTerritory,
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${name}%`
        }
      }
    }]
  }).then(sites => {
    if (sites.length > 0) {
      return sites;
    } else {
      throw new Error("Unable to find requested sites");
    }
  });
}

function getSitesByRegion(region) {
  return Site.findAll({
    include: [{
      model: ProvinceOrTerritory,
      where: {
        region: region
      }
    }]
  }).then(sites => {
    if (sites.length > 0) {
      return sites;
    } else {
      throw new Error("Unable to find requested sites");
    }
  });
}

function getAllProvincesAndTerritories() {
  return ProvinceOrTerritory.findAll();
}

function addSite(siteData) {
  return Site.create(siteData);
}

function editSite(id, siteData) {
  return Site.update(siteData, {
    where: { siteId: id }
  });
}

function deleteSite(id) {
  return Site.destroy({
    where: { siteId: id }
  });
}

module.exports = { 
  initialize, 
  getAllSites, 
  getSiteById, 
  getSitesByRegion, 
  getSitesByProvinceOrTerritoryName,
  getAllProvincesAndTerritories,
  addSite,
  editSite,
  deleteSite
};