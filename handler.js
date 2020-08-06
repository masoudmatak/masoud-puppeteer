const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const { getChrome } = require('./chrome-script');

module.exports.masoudpdf = async (event) => {
	console.log("request: " + JSON.stringify(event));
    const { filename } = event.queryStringParameters;
  
  const texten = event.multiValueQueryStringParameters.texten;
  
  // const { texten } = event.queryStringParameters;
 
 /* const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  });
  const page = await browser.newPage();
  */
  
  const browser=await puppeteer.launch();
  const page = await browser.newPage();
  console.log('innan anropet till goto ...............'+filename);
  console.log('innan anropet till texten ...............'+texten);
  const content="<center><h1>NYTTTTTTTT</h1></center><div>hhahah jhajajajjajaja hahaaahhahaha aa</div><p>hjs s sslks</p>";
  await page.setContent(content);
  const filnamnPdf=filename+'.pdf';
  await page.pdf({
	  path: filnamnPdf,
	  format: 'A4',
	  printBackground:true
  }
  );
 // await page.goto(url, { waitUntil: 'networkidle0' });
 // const content = await page.evaluate(() => document.body.innerHTML);
 
 
 //------------S#---------- 
  s3 = new AWS.S3();
  AWS.config.update({region: 'eu-central-1'});
 // var file = 'ett.pdf';
  var uploadParams = {Bucket: 'masoud-user-data-bucket-123', Key: '', Body: ''};
  var fileStream = fs.createReadStream(filnamnPdf);
   fileStream.on('error', function(err) {
     console.log('File Error', err);
   });
   
  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(filnamnPdf);
  s3.upload (uploadParams, function (err, data) {
  if (err) {
    console.log("Error", err);
  } if (data) {
    console.log("Upload Success", data.Location);
  }
 });
 //------------slut S3------- 
 
 
  console.log('sista raden ...............');
  return {
    statusCode: 200,
    body: JSON.stringify({
      content,
    }),
  };
};
