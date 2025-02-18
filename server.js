const siteData = require("./modules/data-service");

const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'))

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => res.sendFile(__dirname + "/views/home.html"));
app.get("/about", (req, res) => res.sendFile(__dirname + "/views/about.html"));

app.get("/sites", async (req,res)=>{
  let sites = await siteData.getAllSites();
  res.send(sites);
});

app.get('/sites/:siteId', async (req, res) => {
  try {
      const site = await dataService.getSiteById(req.params.siteId);
      if (site) {
          res.json(site);
      } else {
          res.status(404).json({ error: 'Site not found' });
      }
  } catch (error) {
      res.status(404).json({ error: 'Error retrieving site' });
  }
});


app.get('/sites', async (req, res) => {
  try {
      if (req.query.region) {
          const sites = await dataService.getSitesByRegion(req.query.region);
          return res.json(sites);
      } else if (req.query.provinceOrTerritory) {
          const sites = await dataService.getSitesBySubRegionName(req.query.provinceOrTerritory);
          return res.json(sites);
      } else {
          const allSites = await dataService.getAllSites();
          return res.json(allSites);
      }
  } catch (error) {
      res.status(404).json({ error: 'Sites not found' });
  }
});

app.get("/sites/site-id-demo", async (req,res)=>{
  try{
    let site = await siteData.getSiteById("ON016");
    res.send(site);
  }catch(err){
    res.send(err);
  }
});

app.get("/sites/region-demo", async (req,res)=>{
  try{
    let sites = await siteData.getSitesByRegion("Prairie Provinces");
    res.send(sites);
  }catch(err){
    res.send(err);
  }
});

app.get("/sites/province-or-territory-demo", async (req,res)=>{
  try{
    let sites = await siteData.getSitesByProvinceOrTerritoryName("Ontario");
    res.send(sites);
  }catch(err){
    res.send(err);
  }
});

app.use((req, res) => res.status(404).sendFile(__dirname + "/views/404.html"));

siteData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});