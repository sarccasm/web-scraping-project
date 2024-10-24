const puppeteer = require("puppeteer");

async function scrapeUrl(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  try {
    await page.waitForSelector('button[aria-label="Shop Saks Germany"]', {
      timeout: 10000,
    });
    await page.click('button[aria-label="Shop Saks Germany"]');
    console.log("Shop Saks Germany button clicked.");
  } catch (error) {
    console.log("Shop Saks Germany button not found, continuing...");
  }

  await new Promise((r) => setTimeout(r, 5000));

  const result = await page.evaluate(() => {
    const titleElement = document.querySelector("h1");
    const title = titleElement
      ? titleElement.innerText.trim()
      : "Title not found";

    const fullPriceElement = document.querySelector(
      'span[data-testid="originalPrice"]'
    );
    const fullPrice = fullPriceElement
      ? parseFloat(
          fullPriceElement.innerText.replace(/[^\d.,]/g, "").replace(",", ".")
        )
      : null;

    const discountedPriceElement = document.querySelector(
      'span[data-testid="discountedPrice"]'
    );
    const discountedPrice = discountedPriceElement
      ? parseFloat(
          discountedPriceElement.innerText
            .replace(/[^\d.,]/g, "")
            .replace(",", ".")
        )
      : fullPrice;

    const currency = "EUR";

    return { title, fullPrice, discountedPrice, currency };
  });

  await browser.close();
  return result;
}

scrapeUrl(
  "https://de.saks.com/en-de/product/worsted-wool-trousers/0400021301171?color=Light-grey-heather&size=30"
)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
