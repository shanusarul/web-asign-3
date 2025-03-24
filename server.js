/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: __shanus arulanantham____________________ Student ID: _146804232_____________ Date: ___24.03.2025___________
*
*  Published URL: 
*
********************************************************************************/

const siteData = require("./modules/data-service");
const path = require('path');

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));

// Set EJS as the view engine
app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080;

// Updated routes to use res.render instead of res.sendFile
app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about", {page: '/about'}));

// Add Site Routes
app.get("/addSite", async (req, res) => {
  try {
    const provincesAndTerritories = await siteData.getAllProvincesAndTerritories();
    res.render("addSite", { provincesAndTerritories: provincesAndTerritories, page: '/addSite' });
  } catch (error) {
    res.status(500).render("500", { message: error });
  }
});

app.post("/addSite", async (req, res) => {
  try {
    await siteData.addSite(req.body);
    res.redirect("/sites");
  } catch (error) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error.errors[0].message}` });
  }
});

// Edit Site Routes
app.get("/editSite/:id", async (req, res) => {
  try {
    const site = await siteData.getSiteById(req.params.id);
    const provincesAndTerritories = await siteData.getAllProvincesAndTerritories();
    res.render("editSite", { site: site, provincesAndTerritories: provincesAndTerritories, page: '' });
  } catch (error) {
    res.status(404).render("404", { message: error, page: '' });
  }
});

app.post("/editSite", async (req, res) => {
  try {
    await siteData.editSite(req.body.siteId, req.body);
    res.redirect("/sites");
  } catch (error) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error.errors[0].message}` });
  }
});

// Delete Site Route
app.get("/deleteSite/:id", async (req, res) => {
  try {
    await siteData.deleteSite(req.params.id);
    res.redirect("/sites");
  } catch (error) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error.errors[0].message}` });
  }
});

app.get('/sites/:siteId', async (req, res) => {
  try {
    const site = await siteData.getSiteById(req.params.siteId);
    res.render("site", {site: site, page: ''});
  } catch (error) {
    res.status(404).render("404", {message: error, page: ''});
  }
});

app.get('/sites', async (req, res) => {
  try {
    let sites;
    if (req.query.region) {
      sites = await siteData.getSitesByRegion(req.query.region);
    } else if (req.query.provinceOrTerritory) {
      sites = await siteData.getSitesByProvinceOrTerritoryName(req.query.provinceOrTerritory);
    } else {
      sites = await siteData.getAllSites();
    }
    res.render("sites", {sites: sites, page: '/sites'});
  } catch (error) {
    res.status(404).render("404", {message: error, page: ''});
  }
});

// Handle 500 errors
app.use((err, req, res, next) => {
  res.render("500", { message: `An unexpected error occurred: ${err}`, page: '' });
});

// Handle 404 errors
app.use((req, res) => res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for", page: ''}));

siteData.initialize().then(() => {
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
}).catch((err) => {
  console.error("Failed to sync database:", err);
});