const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ipay.webtel.in/sael/';
const OUTPUT_DIR = path.join(__dirname, '../legacy-screens');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 100);
}

async function run() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ 
        headless: 'new',
        channel: 'chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set a normal viewport
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to login page...');
    // We navigate directly to the login frame to avoid frameset issues
    await page.goto(BASE_URL + 'frmMainlogin.aspx', { waitUntil: 'networkidle2' });

    console.log('Filling login credentials...');
    await page.type('#txtUser', 'adminca');
    await page.type('#txtPWD', 'default');
    await page.type('#txtVerificationCode', '1');
    
    console.log('Submitting login...');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
        page.click('#BtnLogin')
    ]);

    console.log('Logged in successfully!');

    // Capture Home Page
    console.log('Capturing Home Page...');
    const homeHtml = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync(path.join(OUTPUT_DIR, '00_HomePage.html'), homeHtml);

    // Extract all navigation links
    console.log('Extracting navigation links...');
    
    // We will find all links in the document that look like they belong to the app
    const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        const uniqueLinks = new Map();
        
        anchors.forEach(a => {
            const href = a.href;
            const text = a.innerText.trim();
            
            // Basic filtering for valid internal pages
            if (href && href.toLowerCase().includes('.aspx') && 
                text && 
                !href.toLowerCase().includes('logout') && 
                !href.toLowerCase().includes('login')) {
                uniqueLinks.set(text, href);
            }
        });
        
        return Array.from(uniqueLinks.entries()).map(([text, href]) => ({ text, href }));
    });

    console.log(`Found ${links.length} unique pages to crawl.`);

    if (links.length === 0) {
        console.log('No links found. The navigation might be inside a frame or rendered differently.');
        // If it's a frame structure, we might need to look inside frames
        const frames = page.frames();
        console.log(`Found ${frames.length} frames.`);
        // Just dump the parent HTML for debugging
        fs.writeFileSync(path.join(OUTPUT_DIR, 'debug_parent.html'), homeHtml);
    }

    // Loop through each link
    for (let i = 0; i < links.length; i++) {
        const { text, href } = links[i];
        const targetUrl = href;
        
        console.log(`[${i+1}/${links.length}] Crawling: ${text} (${targetUrl})`);
        
        try {
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Capture the HTML
            const pageHtml = await page.evaluate(() => {
                // If there are tabs or hidden elements, we just grab the entire body's current state
                return document.body.innerHTML;
            });
            
            const filename = sanitizeFilename(text) + '.html';
            fs.writeFileSync(path.join(OUTPUT_DIR, filename), pageHtml);
        } catch (e) {
            console.error(`Failed to crawl ${text}: ${e.message}`);
        }
    }

    console.log('Crawl complete! Closing browser...');
    await browser.close();
}

run().catch(console.error);
