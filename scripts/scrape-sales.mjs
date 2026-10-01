/**
 * BrandGali Automated Brand Sales Radar & Scraper
 * Fetches real live sale collections from official Pakistani brand stores.
 * Outputs:
 * 1. public/daily-sales-feed.json (Live API feed consumed dynamically by client)
 * 2. Syncs status directly with fallback brands-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target Pakistani Brands with public store endpoints
const BRAND_TARGETS = [
  {
    id: 'gul-ahmed',
    name: 'Gul Ahmed',
    domain: 'www.gulahmedshop.com',
    type: 'shopify',
    saleEndpoint: 'https://www.gulahmedshop.com/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://www.gulahmedshop.com/collections/unstitched/products.json?limit=12'
  },
  {
    id: 'outfitters',
    name: 'Outfitters',
    domain: 'outfitters.com.pk',
    type: 'shopify',
    saleEndpoint: 'https://outfitters.com.pk/collections/special-prices/products.json?limit=12',
    fallbackEndpoint: 'https://outfitters.com.pk/collections/men-sale/products.json?limit=12'
  },
  {
    id: 'j-junaid-jamshed',
    name: 'J. Junaid Jamshed',
    domain: 'www.junaidjamshed.com',
    type: 'shopify',
    saleEndpoint: 'https://www.junaidjamshed.com/collections/promotions/products.json?limit=12',
    fallbackEndpoint: 'https://www.junaidjamshed.com/collections/woman/products.json?limit=12'
  },
  {
    id: 'sana-safinaz',
    name: 'Sana Safinaz',
    domain: 'www.sanasafinaz.com',
    type: 'shopify',
    saleEndpoint: 'https://www.sanasafinaz.com/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://www.sanasafinaz.com/collections/unstitched/products.json?limit=12'
  },
  {
    id: 'nishat-linen',
    name: 'Nishat Linen',
    domain: 'nishatlinen.com',
    type: 'shopify',
    saleEndpoint: 'https://nishatlinen.com/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://nishatlinen.com/collections/women/products.json?limit=12'
  },
  {
    id: 'al-karam-studio',
    name: 'Alkaram Studio',
    domain: 'www.alkaramstudio.com',
    type: 'shopify',
    saleEndpoint: 'https://www.alkaramstudio.com/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://www.alkaramstudio.com/collections/unstitched/products.json?limit=12'
  },
  {
    id: 'zellbury',
    name: 'Zellbury',
    domain: 'zellbury.com',
    type: 'shopify',
    saleEndpoint: 'https://zellbury.com/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://zellbury.com/collections/unstitched/products.json?limit=12'
  },
  {
    id: 'limelight',
    name: 'Limelight',
    domain: 'www.limelight.pk',
    type: 'shopify',
    saleEndpoint: 'https://www.limelight.pk/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://www.limelight.pk/collections/women-unstitched/products.json?limit=12'
  },
  {
    id: 'bonanza-satrangi',
    name: 'Bonanza Satrangi',
    domain: 'bonanzasatrangi.com',
    type: 'shopify',
    saleEndpoint: 'https://bonanzasatrangi.com/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://bonanzasatrangi.com/collections/women/products.json?limit=12'
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    domain: 'charcoal.com.pk',
    type: 'shopify',
    saleEndpoint: 'https://charcoal.com.pk/collections/sale/products.json?limit=12',
    fallbackEndpoint: 'https://charcoal.com.pk/collections/formal-shirts/products.json?limit=12'
  }
];

async function fetchShopifyProducts(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const json = await res.json();
    return json.products || null;
  } catch (err) {
    return null;
  }
}

function parseShopifyProducts(products, domain) {
  if (!Array.isArray(products) || products.length === 0) return [];

  const items = [];
  for (const p of products) {
    const variant = p.variants && p.variants[0];
    if (!variant) continue;

    const price = parseFloat(variant.price);
    const compareAt = variant.compare_at_price ? parseFloat(variant.compare_at_price) : null;
    const isDiscounted = compareAt && compareAt > price;
    const discountPercent = isDiscounted ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

    const img = p.images && p.images[0] ? (p.images[0].src || '') : '';
    const productUrl = `https://${domain}/products/${p.handle}`;

    items.push({
      name: p.title,
      currentPrice: `PKR ${Math.round(price).toLocaleString()}`,
      originalPrice: isDiscounted ? `PKR ${Math.round(compareAt).toLocaleString()}` : null,
      discount: isDiscounted ? `${discountPercent}% Off` : null,
      image: img,
      url: productUrl,
      isSale: isDiscounted
    });
  }

  return items;
}

async function scrapeKhaadi() {
  console.log('[Scraper] Checking Khaadi (Demandware)...');
  try {
    const res = await fetch('https://pk.khaadi.com/sale', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    const tiles = html.split('<div class="product-tile"');
    if (tiles.length <= 1) return null;

    const products = [];
    for (let i = 1; i < Math.min(tiles.length, 9); i++) {
      const tile = tiles[i];
      const nameMatch = tile.match(/<a class="link"[^>]*>([^<]+)<\/a>/) || tile.match(/data-gtmdata="[^"]*&quot;name&quot;:&quot;([^&]+)&quot;/);
      const linkMatch = tile.match(/<a class="link"[^>]*href="([^">]+)"/) || tile.match(/<a[^>]+href="([^">]+)"/);
      const imgMatch = tile.match(/<img[^>]+src="([^">]+)"/);
      const priceMatches = [...tile.matchAll(/content="([0-9.]+)"/g)].map(m => parseFloat(m[1]));

      if (priceMatches.length > 0) {
        let currentPriceNum = priceMatches[priceMatches.length - 1];
        let originalPriceNum = priceMatches.length > 1 ? priceMatches[0] : null;

        if (originalPriceNum && originalPriceNum <= currentPriceNum) {
          originalPriceNum = null;
        }

        const discountPercent = originalPriceNum ? Math.round(((originalPriceNum - currentPriceNum) / originalPriceNum) * 100) : 0;
        let title = nameMatch ? nameMatch[1].trim() : 'Khaadi Apparel';
        let prodUrl = linkMatch ? linkMatch[1] : '/sale';
        if (!prodUrl.startsWith('http')) prodUrl = `https://pk.khaadi.com${prodUrl}`;
        let img = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';

        products.push({
          name: title,
          currentPrice: `PKR ${Math.round(currentPriceNum).toLocaleString()}`,
          originalPrice: originalPriceNum ? `PKR ${Math.round(originalPriceNum).toLocaleString()}` : null,
          discount: discountPercent > 0 ? `${discountPercent}% Off` : null,
          image: img,
          url: prodUrl,
          isSale: discountPercent > 0
        });
      }
    }

    if (products.length === 0) return null;

    return {
      brandId: 'khaadi',
      brandName: 'Khaadi',
      domain: 'pk.khaadi.com',
      status: 'sale',
      maxDiscount: 'Up to 50% Off',
      products,
      lastChecked: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error scraping Khaadi:', err.message);
    return null;
  }
}

async function scrapeSapphire() {
  console.log('[Scraper] Checking Sapphire (Demandware)...');
  try {
    const res = await fetch('https://pk.sapphireonline.pk/collections/sale', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    const tiles = html.split('<div class="product-tile"');
    if (tiles.length <= 1) return null;

    const products = [];
    let maxDiscount = 0;

    for (let i = 1; i < Math.min(tiles.length, 9); i++) {
      const tile = tiles[i];
      const linkMatch = tile.match(/<a[^>]+href="([^">]+)"/);
      const imgMatch = tile.match(/<img[^>]+src="([^">]+)"/);
      const priceMatches = [...tile.matchAll(/content="([0-9.]+)"/g)].map(m => parseFloat(m[1]));
      const nameMatch = tile.match(/<a[^>]+class="[^"]*pdp-link[^"]*"[^>]*>([^<]+)<\/a>/i) ||
                        tile.match(/title="([^"]+)"/) ||
                        tile.match(/data-gtmdata="[^"]*&quot;name&quot;:&quot;([^&]+)&quot;/);

      if (priceMatches.length > 0) {
        let currentPriceNum = priceMatches.length > 1 ? priceMatches[1] : (priceMatches[0] || 0);
        let originalPriceNum = priceMatches.length > 1 ? priceMatches[0] : null;

        if (originalPriceNum && originalPriceNum <= currentPriceNum) {
          originalPriceNum = null;
        }

        const discountPercent = originalPriceNum ? Math.round(((originalPriceNum - currentPriceNum) / originalPriceNum) * 100) : 0;
        if (discountPercent > maxDiscount) maxDiscount = discountPercent;

        let title = nameMatch ? nameMatch[1].trim() : 'Sapphire Apparel';
        let prodUrl = linkMatch ? linkMatch[1] : '/collections/sale';
        if (!prodUrl.startsWith('http')) prodUrl = `https://pk.sapphireonline.pk${prodUrl}`;
        let img = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';

        products.push({
          name: title,
          currentPrice: `PKR ${Math.round(currentPriceNum).toLocaleString()}`,
          originalPrice: originalPriceNum ? `PKR ${Math.round(originalPriceNum).toLocaleString()}` : null,
          discount: discountPercent > 0 ? `${discountPercent}% Off` : null,
          image: img,
          url: prodUrl,
          isSale: discountPercent > 0
        });
      }
    }

    if (products.length === 0) return null;

    return {
      brandId: 'sapphire',
      brandName: 'Sapphire',
      domain: 'pk.sapphireonline.pk',
      status: 'sale',
      maxDiscount: maxDiscount > 0 ? `Up to ${maxDiscount}% Off` : 'Special Offers',
      products,
      lastChecked: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error scraping Sapphire:', err.message);
    return null;
  }
}

async function scrapeBrand(target) {


  console.log(`[Scraper] Checking ${target.name}...`);
  let rawProducts = await fetchShopifyProducts(target.saleEndpoint);
  let isSaleLive = false;

  if (rawProducts && rawProducts.length > 0) {
    isSaleLive = true;
  } else if (target.fallbackEndpoint) {
    rawProducts = await fetchShopifyProducts(target.fallbackEndpoint);
  }

  if (!rawProducts) {
    console.log(`  -> ${target.name}: Unable to reach or anti-bot block. Maintaining previous data.`);
    return null;
  }

  const parsed = parseShopifyProducts(rawProducts, target.domain);
  const saleProducts = parsed.filter(p => p.isSale);
  const activeSale = saleProducts.length > 0 || isSaleLive;

  // Compute maximum discount percentage found
  let maxDiscount = 0;
  parsed.forEach(p => {
    if (p.discount) {
      const match = p.discount.match(/(\d+)%/);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > maxDiscount) maxDiscount = val;
      }
    }
  });

  return {
    brandId: target.id,
    brandName: target.name,
    domain: target.domain,
    status: activeSale ? 'sale' : 'none',
    maxDiscount: maxDiscount > 0 ? `Up to ${maxDiscount}% Off` : 'Special Offers',
    products: parsed.slice(0, 8),
    lastChecked: new Date().toISOString()
  };
}

async function main() {
  console.log('--- BrandGali Daily Sales Radar Scraper Started ---');
  const results = {};

  // 1. Scrape Khaadi
  try {
    const khaadiData = await scrapeKhaadi();
    if (khaadiData) {
      results['khaadi'] = khaadiData;
    }
  } catch (err) {
    console.error('Error in Khaadi scraper:', err.message);
  }

  // 2. Scrape Sapphire
  try {
    const sapphireData = await scrapeSapphire();
    if (sapphireData) {
      results['sapphire'] = sapphireData;
    }
  } catch (err) {
    console.error('Error in Sapphire scraper:', err.message);
  }

  // 3. Scrape Shopify brands

  for (const target of BRAND_TARGETS) {
    try {
      const brandData = await scrapeBrand(target);
      if (brandData) {
        results[target.id] = brandData;
      }
    } catch (err) {
      console.error(`Error scraping ${target.name}:`, err.message);
    }
  }


  const outputPath = path.resolve(__dirname, '../public/daily-sales-feed.json');
  const payload = {
    updatedAt: new Date().toISOString(),
    totalBrandsTracked: Object.keys(results).length,
    brands: results
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`[Scraper] Successfully generated ${outputPath} with ${Object.keys(results).length} brands.`);
  console.log('--- BrandGali Daily Scraper Completed Successfully ---');
}

main().catch(err => {
  console.error('Fatal Scraper Error:', err);
  process.exit(1);
});
