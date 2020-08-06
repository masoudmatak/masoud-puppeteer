const puppeteer = require('puppeteer');
const fs=require('fs-extra');
const hbs=require('handlebars');
const data=require('./database.json');
const path=require('path');
const moment=require('moment');

const compile = async function(templateName, data){
 const filePath= path.join(process.cwd(), 'templates','shot-list.html');
 const html = await fs.readFile(filePath,'utf-8');
 return hbs.compile(html)(data);
};


hbs.registerHelper('dateFormat', function( value,format  ){
	//console.log('formatting',value,format);
	return moment(value).format(format);
});

(async function(){

try{
const browser=await puppeteer.launch();
const page=await browser.newPage();

const content= await compile('shot-list',data);

await page.setContent(content);
await page.pdf({
path: 'advanced.pdf',
format: 'A4',
printBackgrund:true
});
console.log('done');
await browser.close();
process.exit();

}catch(e){
console.log('our error', e);
}

})();
