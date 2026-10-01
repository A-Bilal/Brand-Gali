// BrandGali Data & Helper Functions

const CATEGORIES = [
  { name: 'Clothing', icon: 'fa-shirt' },
  { name: 'Footwear', icon: 'fa-shoe-prints' },
  { name: 'Home Décor', icon: 'fa-couch' },
  { name: 'Lifestyle', icon: 'fa-star' },
  { name: 'Kitchen & Accessories', icon: 'fa-kitchen-set' },
  { name: 'Bags', icon: 'fa-bag-shopping' }
];

let liveFeedLoaded = false;

function loadSalesStatus() {
  const currentBrands = typeof BRANDS !== 'undefined' ? BRANDS : (typeof window !== 'undefined' && window.BRANDS ? window.BRANDS : []);

  if (liveFeedLoaded) {
    return Promise.resolve(currentBrands);
  }

  // Fetch the daily automated radar feed
  return fetch('/daily-sales-feed.json')
    .then((res) => {
      if (!res.ok) throw new Error('Live feed unavailable');
      return res.json();
    })
    .then((feed) => {
      if (feed && feed.brands) {
        liveFeedLoaded = true;
        // Merge freshly scraped discounts and products into BRANDS
        for (const [brandId, scraped] of Object.entries(feed.brands)) {
          const match = currentBrands.find((b) => b.id === brandId);
          if (match && scraped) {
            match.status = scraped.status;
            if (scraped.status === 'sale') {
              match.live = match.live || {};
              match.live.off = scraped.maxDiscount || match.live.off || 'Sale Live';
              if (scraped.products && scraped.products.length > 0) {
                match.sale = match.sale || {};
                match.sale.headline = `${match.name} Official Sale - ${scraped.maxDiscount}`;
                match.sale.products = scraped.products;
              }
            }
          }
        }
      }
      return currentBrands;
    })
    .catch((err) => {
      // Gracefully fall back to bundled static snapshot
      return currentBrands;
    });
}


if (typeof window !== 'undefined') {
  window.CATEGORIES = CATEGORIES;
  window.loadSalesStatus = loadSalesStatus;
}

const BRANDS = [
  {
    id: 'khaadi',
    name: 'Khaadi',
    category: 'Clothing',
    url: 'https://pk.khaadi.com',
    color: '#0EA98B',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 50% Off' },
    sale: {
      headline: 'Mid-Season Clearance - Up to 50% Off',
      sourceUrl: 'https://pk.khaadi.com/sale',
      products: [
        {
          name: 'Printed 3-Piece Lawn Tailored Suit',
          currentPrice: 'PKR 5,250',
          originalPrice: 'PKR 7,000',
          discount: '25% Off',
          image: 'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw86b2df8a/images/hi-res/t-a22-26-211fg2_multi_1.jpg',
          url: 'https://pk.khaadi.com/tailored-3-piece-lawn/T-A22-26-211FG2-VG_MULTI.html'
        },
        {
          name: 'Embroidered Lawn 3-Piece Unstitched',
          currentPrice: 'PKR 4,500',
          originalPrice: 'PKR 6,000',
          discount: '25% Off',
          image: 'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw6854dadc/images/hi-res/a11-26-216fb1-e_multi_1.jpg',
          url: 'https://pk.khaadi.com/fabrics-3-piece/A11-26-216FB1-E-VG_MULTI.html'
        },
        {
          name: 'Black Lawn Stitched Kurta',
          currentPrice: 'PKR 3,000',
          originalPrice: 'PKR 5,000',
          discount: '40% Off',
          image: 'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw4e728446/images/hi-res/t-a22-26-206fg1_multi_2.jpg',
          url: 'https://pk.khaadi.com/black-lawn-kurta/1-26-244-A-D1-VG_MULTI.html'
        }

      ]
    }
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    category: 'Clothing',
    url: 'https://pk.sapphireonline.pk',
    color: '#1B2A5E',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 40% Off' },
    sale: {
      headline: 'Special Offers - Up to 40% Off',
      sourceUrl: 'https://pk.sapphireonline.pk/collections/sale',
      products: [
        {
          name: '3 Piece - Embroidered Lawn Suit',
          currentPrice: 'PKR 8,994',
          originalPrice: 'PKR 14,990',
          discount: '40% Off',
          image: 'https://pk.sapphireonline.pk/dw/image/v2/BKSB_PRD/on/demandware.static/-/Sites-sapphire-master-catalog/default/dwca20472d/images/April26/22ndApril26/U3PESUS26V41_1.JPG?sw=1000&sh=1200',
          url: 'https://pk.sapphireonline.pk/collections/sale/products/U3PESUS26V41.html'
        },
        {
          name: '3 Piece - Printed Lawn Suit',
          currentPrice: 'PKR 3,432',
          originalPrice: 'PKR 4,290',
          discount: '20% Off',
          image: 'https://pk.sapphireonline.pk/dw/image/v2/BKSB_PRD/on/demandware.static/-/Sites-sapphire-master-catalog/default/dwe57cc6e3/images/July26/1stJuly26/U3PDDS26V620_1.jpg?sw=1000&sh=1200',
          url: 'https://pk.sapphireonline.pk/products/U3PDDS26V620.html'
        },
        {
          name: '3 Piece - Printed Lawn Suit',
          currentPrice: 'PKR 3,213',
          originalPrice: 'PKR 4,590',
          discount: '30% Off',
          image: 'https://pk.sapphireonline.pk/dw/image/v2/BKSB_PRD/on/demandware.static/-/Sites-sapphire-master-catalog/default/dw6014c512/images/July26/31stJuly26/U3PDYS26V714_1.JPG?sw=1000&sh=1200',
          url: 'https://pk.sapphireonline.pk/products/U3PDYS26V714.html'
        }
      ]
    }

  },
  {
    id: 'gul-ahmed',
    name: 'Gul Ahmed',
    category: 'Clothing',
    url: 'https://www.gulahmedshop.com',
    color: '#F08A1E',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 70% Off' },
    sale: {
      headline: 'The Great Pakistan Sale - Up to 70% Off',
      sourceUrl: 'https://www.gulahmedshop.com/sale',
      products: [
        {
          name: '3 Piece Unstitched Printed Soya Silk Suit',
          currentPrice: 'PKR 4,990',
          originalPrice: 'PKR 6,990',
          discount: '29% Off',
          image: 'https://www.gulahmedshop.com/cdn/shop/files/Printed-Lawn-Dupatta-Printed-Cotton-Shirt-Dyed-Trouser-Gulahmed-CBN-62036-Side_1000x.jpg',
          url: 'https://www.gulahmedshop.com/products/3-piece-unstitched-printed-soya-silk-suit-with-printed-chiffon-dupatta-sy-52003'
        },
        {
          name: 'Forever Cotton Unstitched Men Fabric (Suit)',
          currentPrice: 'PKR 3,490',
          originalPrice: 'PKR 5,200',
          discount: '33% Off',
          image: 'https://www.gulahmedshop.com/cdn/shop/files/forever-cotton-vt-unstitched-fabric-cotton-dark-camel-fullshot-front_720x.jpg',
          url: 'https://www.gulahmedshop.com/products/forever-cotton-unstitched-fabric-cotton-lf'
        }
      ]
    }
  },
  {
    id: 'j-junaid-jamshed',
    name: 'J. Junaid Jamshed',
    category: 'Clothing',
    url: 'https://www.junaidjamshed.com',
    color: '#12183A',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 25% Off' },
    sale: {
      headline: 'Festive Flash Sale - Flat 25% Off Storewide',
      sourceUrl: 'https://www.junaidjamshed.com/sale',
      products: [
        {
          name: 'Blue Lawn Printed Kurti',
          currentPrice: 'PKR 1,290',
          originalPrice: 'PKR 2,490',
          discount: '48% Off',
          image: 'https://cdn.shopify.com/s/files/1/0702/2487/1584/files/jts-25-4044_1_8eeff52d-ea3b-4323-8070-e3d414d85e3f.jpg?v=1776977413',
          url: 'https://www.junaidjamshed.com/products/blue-lawn-printed-kurti-jygk-s-jts-25-4044-fb-essentials-t-15'
        },
        {
          name: 'Green Lawn Printed Kurti',
          currentPrice: 'PKR 1,290',
          originalPrice: 'PKR 2,490',
          discount: '48% Off',
          image: 'https://cdn.shopify.com/s/files/1/0702/2487/1584/files/jts-25-4042_1_10fc733e-d05a-4557-93f3-2d8882d28887.jpg?v=1776977413',
          url: 'https://www.junaidjamshed.com/products/green-lawn-printed-kurti-jygk-s-jts-25-4042-fb-essential-0t-13'
        },
        {
          name: 'Khumar Pour Homme Body Spray',
          currentPrice: 'PKR 750',
          originalPrice: 'PKR 950',
          discount: '21% Off',
          image: 'https://cdn.shopify.com/s/files/1/0702/2487/1584/files/khumar_body_spray_1_cf17e01b-e1c3-4793-859a-67f6c12f0dc9.jpg?v=1776981820',
          url: 'https://www.junaidjamshed.com/products/khumar-body-spray'
        }
      ]
    }
  },
  {
    id: 'outfitters',
    name: 'Outfitters',
    category: 'Clothing',
    url: 'https://outfitters.com.pk',
    color: '#D5473F',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 50% Off' },
    sale: {
      headline: 'End of Season Rush - Up to 50% Off',
      sourceUrl: 'https://outfitters.com.pk/pages/sale',
      products: [
        {
          name: 'Slogan Print Casual T-Shirt',
          currentPrice: 'PKR 1,190',
          originalPrice: 'PKR 2,490',
          discount: '52% Off',
          image: 'https://cdn.shopify.com/s/files/1/2290/7887/files/F2077106903.jpg?v=1783590970',
          url: 'https://outfitters.com.pk/products/f2077-106',
          fabric: '100% Breathable Cotton',
          type: 'Men Casual Crewneck',
          sizes: ['S', 'M', 'L', 'XL'],
          description: 'Contemporary streetwear graphic tee in soft cotton jersey with rib-knit collar.'
        },
        {
          name: 'Graphic Streetwear T-Shirt',
          currentPrice: 'PKR 990',
          originalPrice: 'PKR 2,090',
          discount: '53% Off',
          image: 'https://cdn.shopify.com/s/files/1/2290/7887/files/F1300506311_2_copy.jpg?v=1777267135',
          url: 'https://outfitters.com.pk/products/f1300-506',
          fabric: 'Mercerized Cotton Blend',
          type: 'Casual Streetwear',
          sizes: ['S', 'M', 'L', 'XL'],
          description: 'Relaxed fit short-sleeve t-shirt with signature chest artwork and clean finished hems.'
        },
        {
          name: 'Signature Graphic Pencil Case',
          currentPrice: 'PKR 790',
          originalPrice: 'PKR 1,690',
          discount: '53% Off',
          image: 'https://cdn.shopify.com/s/files/1/2290/7887/files/F0054513629_2_copy.jpg?v=1756719257',
          url: 'https://outfitters.com.pk/products/f0054-513'
        }
      ]
    }
  },
  {
    id: 'nishat-linen',
    name: 'Nishat Linen',
    category: 'Clothing',
    url: 'https://nishatlinen.com',
    color: '#0B7D68',
    status: 'new',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'alkaram-studio',
    name: 'Alkaram Studio',
    category: 'Clothing',
    url: 'https://www.alkaramstudio.com',
    color: '#F5A623',
    status: 'sale',
    featured: false,
    live: { off: 'Flat 40% Off' },
    sale: {
      headline: 'Mid-Season Specials - Flat 40% Off',
      sourceUrl: 'https://www.alkaramstudio.com/sale',
      products: [
        {
          name: 'RTS | Shirt, Trouser & Dupatta (3PC)',
          currentPrice: 'PKR 2,789',
          originalPrice: 'PKR 4,290',
          discount: '35% Off',
          image: 'https://cdn.shopify.com/s/files/1/0623/6481/1444/files/SS-59.1-25-3-Green-1_13dccdfa-6d9d-4339-866c-e03bc5dfebcc.jpg?v=1768297181',
          url: 'https://www.alkaramstudio.com/products/rts-shirt-trouser-dupatta-ss-59-1-25-3-green',
          fabric: 'Premium Lawn with Chiffon Dupatta',
          type: '3-Piece Ready-to-Wear Suit',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          description: 'Contemporary printed lawn 3-piece suit with dyed matching trousers and breezy chiffon dupatta.'
        },
        {
          name: 'RTS Daily Kurti Shirt',
          currentPrice: 'PKR 973',
          originalPrice: 'PKR 1,390',
          discount: '30% Off',
          image: 'https://cdn.shopify.com/s/files/1/0623/6481/1444/files/BD83-26-2-Beige-1_cffaca6b-fb79-42ca-9930-e4b5eea303ba.jpg?v=1771313908',
          url: 'https://www.alkaramstudio.com/products/rts-shirt-bd83-26-2-beige',
          fabric: '100% Breathable Cambric Cotton',
          type: '1-Piece Stitched Kurti',
          sizes: ['S', 'M', 'L', 'XL'],
          description: 'Everyday cambric kurti featuring subtle geometric prints and tailored round neck.'
        },
        {
          name: 'RTS Printed Summer Kurti',
          currentPrice: 'PKR 1,043',
          originalPrice: 'PKR 1,490',
          discount: '30% Off',
          image: 'https://cdn.shopify.com/s/files/1/0623/6481/1444/files/BD82-26-2-Beige-1_cb3b6698-8c1b-4d0e-aa83-8f22f86fc073.jpg?v=1771313906',
          url: 'https://www.alkaramstudio.com/products/rts-shirt-bd82-26-2-beige',
          fabric: '100% Fine Lawn',
          type: '1-Piece Stitched Kurti',
          sizes: ['XS', 'S', 'M', 'L'],
          description: 'Lightweight summer lawn kurti with stylized band collar and folded cuffs.'
        }
      ]
    }
  },
  {
    id: 'sana-safinaz',
    name: 'Sana Safinaz',
    category: 'Clothing',
    url: 'https://www.sanasafinaz.com',
    color: '#2A3B75',
    status: 'normal',
    featured: true,
    live: null,
    sale: null
  },
  {
    id: 'maria-b',
    name: 'Maria.B',
    category: 'Clothing',
    url: 'https://www.mariab.pk',
    color: '#6B3A82',
    status: 'normal',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'breakout',
    name: 'Breakout',
    category: 'Clothing',
    url: 'https://www.breakout.com.pk',
    color: '#C0392B',
    status: 'sale',
    featured: false,
    live: { off: 'Up to 50% Off' },
    sale: {
      headline: 'Urban Drop Sale - Up to 50% Off',
      sourceUrl: 'https://www.breakout.com.pk/pages/sale',
      products: [
        {
          name: 'Relaxed Fit Button Down Super Soft Polo',
          currentPrice: 'PKR 2,690',
          originalPrice: 'PKR 4,499',
          discount: '40% Off',
          image: 'https://cdn.shopify.com/s/files/1/0202/5884/8822/files/26FHP230-TPN_4.jpg?v=1789968204',
          url: 'https://www.breakout.com.pk/products/26fhp230-tpn',
          fabric: 'Ultra-Soft Cotton Knit',
          type: 'Smart Casual Polo',
          sizes: ['S', 'M', 'L', 'XL'],
          description: 'Relaxed fit button-down knit polo offering breathable softness for everyday style.'
        },
        {
          name: 'Boxy Fit Linen Casual Shirt',
          currentPrice: 'PKR 3,290',
          originalPrice: 'PKR 5,499',
          discount: '40% Off',
          image: 'https://cdn.shopify.com/s/files/1/0202/5884/8822/files/26FFW222-OLV_3.jpg?v=1789968208',
          url: 'https://www.breakout.com.pk/products/26ffw222-olv',
          fabric: 'Breathable Linen Blend',
          type: 'Casual Streetwear Shirt',
          sizes: ['S', 'M', 'L', 'XL'],
          description: 'Boxy cut short sleeve shirt in natural olive linen blend with relaxed chest pocket.'
        },
        {
          name: 'Button Down Oxford Casual Shirt',
          currentPrice: 'PKR 2,490',
          originalPrice: 'PKR 3,999',
          discount: '38% Off',
          image: 'https://cdn.shopify.com/s/files/1/0202/5884/8822/files/26FFW221-YEL_4.jpg?v=1789968215',
          url: 'https://www.breakout.com.pk/products/26ffw221-yel'
        }
      ]
    }
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    category: 'Clothing',
    url: 'https://charcoal.com.pk',
    color: '#34495E',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 30% Off' },
    sale: {
      headline: 'Executive Casuals - Flat 30% Off',
      sourceUrl: 'https://charcoal.com.pk/collections/sale',
      urgency: 'Limited Time',
      products: [
        {
          name: 'Executive Silver-Tone Formal Cufflinks',
          currentPrice: 'PKR 2,096',
          originalPrice: 'PKR 2,995',
          discount: '30% Off',
          image: 'https://cdn.shopify.com/s/files/1/0419/6171/7922/files/DSC01702.1.webp?v=1789982856',
          url: 'https://charcoal.com.pk/products/cufflinks-355',
          type: 'Executive Formal Accessories',
          description: 'High-polish precision metallic cufflinks designed for business formal and suiting occasions.'
        },
        {
          name: 'Classic Black Enamel Cufflinks',
          currentPrice: 'PKR 2,096',
          originalPrice: 'PKR 2,995',
          discount: '30% Off',
          image: 'https://cdn.shopify.com/s/files/1/0419/6171/7922/files/DSC01682.1_d010cde8-bdec-4471-8371-1a51767fb395.webp?v=1789982564',
          url: 'https://charcoal.com.pk/products/cufflinks-354',
          type: 'Executive Formal Accessories',
          description: 'Sleek black enamel and chrome plated cufflinks for evening shirts and tuxedos.'
        }
      ]
    }
  },
  {
    id: 'stylo',
    name: 'Stylo',
    category: 'Footwear',
    url: 'https://stylo.pk',
    color: '#E91E63',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 51% Off' },
    sale: {
      headline: 'Mega Footwear Fiesta - Up to 51% Off',
      sourceUrl: 'https://stylo.pk/collections/sale',
      products: [
        {
          name: 'Coffee Casual Sneaker For Women',
          currentPrice: 'PKR 1,499',
          originalPrice: 'PKR 3,000',
          discount: '50% Off',
          image: 'https://cdn.shopify.com/s/files/1/0485/1459/7030/files/WN622341_1.webp?v=1788341674',
          url: 'https://stylo.pk/products/coffee-casual-sneaker-for-women-wn6223'
        },
        {
          name: 'Maroon Casual Slipper For Women',
          currentPrice: 'PKR 1,000',
          originalPrice: 'PKR 2,000',
          discount: '50% Off',
          image: 'https://cdn.shopify.com/s/files/1/0485/1459/7030/files/CL217905.webp?v=1783059780',
          url: 'https://stylo.pk/products/maroon-casual-slipper-for-women-cl2179'
        },
        {
          name: 'Green Casual Softy For Ladies',
          currentPrice: 'PKR 999',
          originalPrice: 'PKR 2,000',
          discount: '50% Off',
          image: 'https://cdn.shopify.com/s/files/1/0485/1459/7030/files/CL564011.webp?v=1788870722',
          url: 'https://stylo.pk/products/green-casual-softy-for-ladies-cl5640'
        }
      ]
    }
  },
  {
    id: 'servis',
    name: 'Servis Shoes',
    category: 'Footwear',
    url: 'https://servis.pk',
    color: '#D32F2F',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 30% Off' },
    sale: {
      headline: 'Cheetah & Ndure Days - Flat 30% Off',
      sourceUrl: 'https://servis.pk/collections/sale',
      products: [
        {
          name: "Men's Formal Shoes Dark Brown",
          currentPrice: 'PKR 2,999',
          originalPrice: 'PKR 3,999',
          discount: '25% Off',
          image: 'https://cdn.shopify.com/s/files/1/0055/5525/7462/files/M-SR-0200049D.BROWN.jpg?v=1789736410',
          url: 'https://servis.pk/products/m-sr-0200049-d-brown'
        },
        {
          name: "Men's Formal Leather Shoes Classic",
          currentPrice: 'PKR 3,749',
          originalPrice: 'PKR 4,999',
          discount: '25% Off',
          image: 'https://cdn.shopify.com/s/files/1/0055/5525/7462/files/M-SR-0200047D.BROWN.jpg?v=1789739653',
          url: 'https://servis.pk/products/m-sr-0200047-d-brown'
        }
      ]
    }
  },
  {
    id: 'ndure',
    name: 'Ndure',
    category: 'Footwear',
    url: 'https://ndure.com',
    color: '#1565C0',
    status: 'sale',
    featured: false,
    live: { off: 'Up to 40% Off' },
    sale: {
      headline: 'Everyday Comfort Clearance - Up to 40% Off',
      sourceUrl: 'https://ndure.com/collections/sale',
      products: [
        {
          name: "Women's Soft Comfort Slides Chappals",
          currentPrice: 'PKR 3,499',
          originalPrice: 'PKR 4,999',
          discount: '30% Off',
          image: 'https://cdn.shopify.com/s/files/1/0371/5416/0772/files/W-PL-DOC-0011-OILVE.jpg?v=1772778765',
          url: 'https://ndure.com/products/womens-soft-chappals-w-pl-doc-0011-olive'
        },
        {
          name: "Men's Colorblock High-Top Sneakers",
          currentPrice: 'PKR 3,290',
          originalPrice: 'PKR 5,499',
          discount: '40% Off',
          image: 'https://cdn.shopify.com/s/files/1/0371/5416/0772/files/4_c5e6f588-8136-441b-a619-05456d4bc1f2.jpg?v=1789965056',
          url: 'https://ndure.com/products/mens-colorblock-high-top-sneakers-m-sn-urb-0012-nvy-tan'
        }
      ]
    }
  },
  {
    id: 'borjan',
    name: 'Borjan',
    category: 'Footwear',
    url: 'https://www.borjan.com.pk',
    color: '#8E44AD',
    status: 'normal',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'bata-pk',
    name: 'Bata Pakistan',
    category: 'Footwear',
    url: 'https://www.bata.com.pk',
    color: '#C0392B',
    status: 'new',
    featured: true,
    live: null,
    sale: null
  },
  {
    id: 'habitt',
    name: 'Habitt',
    category: 'Home Décor',
    url: 'https://habitt.com',
    color: '#27AE60',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 40% Off' },
    sale: {
      headline: 'Living Space Revamp - Up to 40% Off',
      sourceUrl: 'https://habitt.com/collections/sale',
      products: [
        {
          name: 'Foldable Multi-Tier Clothes Drying Rack',
          currentPrice: 'PKR 4,290',
          originalPrice: 'PKR 4,999',
          discount: '14% Off',
          image: 'https://cdn.shopify.com/s/files/1/0429/7654/2881/files/2b213ab5-5239-4ad8-b310-f31371c09f2f-md.jpg?v=1767783946',
          url: 'https://habitt.com/products/laundry-dryer-rack-foldable-multi-tier-clothes-drying-stand'
        },
        {
          name: 'Munch Box Kids Lunch Box with Compartments',
          currentPrice: 'PKR 990',
          originalPrice: 'PKR 1,249',
          discount: '21% Off',
          image: 'https://cdn.shopify.com/s/files/1/0429/7654/2881/files/MunchBox02BLue.jpg?v=1758521644',
          url: 'https://habitt.com/products/1pc-munch-box-2-kids-lunch-box-with-compartments'
        }
      ]
    }
  },
  {
    id: 'ideas-home',
    name: 'Ideas Home',
    category: 'Home Décor',
    url: 'https://www.gulahmedshop.com/ideas-home',
    color: '#E67E22',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 50% Off' },
    sale: {
      headline: 'Bed & Bath Luxury Sale - Flat 50% Off',
      sourceUrl: 'https://www.gulahmedshop.com/ideas-home/sale',
      products: [
        {
          name: 'Ideas Home Printed Bed Sheet Set',
          currentPrice: 'PKR 3,450',
          originalPrice: 'PKR 6,900',
          discount: '50% Off',
          image: 'https://www.gulahmedshop.com/cdn/shop/files/BeigeLightBambooTowel_4_1000x.jpg',
          url: 'https://www.gulahmedshop.com/products/ss26-048-bed-sheet-set'
        }
      ]
    }
  },
  {
    id: 'chenone',
    name: 'ChenOne',
    category: 'Home Décor',
    url: 'https://chenone.com',
    color: '#16A085',
    status: 'normal',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'miniso-pk',
    name: 'Miniso Pakistan',
    category: 'Lifestyle',
    url: 'https://miniso.pk',
    color: '#E74C3C',
    status: 'sale',
    featured: true,
    live: { off: 'Special Deals' },
    sale: {
      headline: 'Happy Lifestyle Festival - Buy 2 Get 1 Free',
      sourceUrl: 'https://miniso.pk',
      products: [
        {
          name: 'Professional Ear Picks Set (6 pcs)',
          currentPrice: 'PKR 450',
          originalPrice: 'PKR 650',
          discount: '30% Off',
          image: 'https://cdn.shopify.com/s/files/1/0500/8539/6644/files/6931798806908-1.jpg?v=1772010303',
          url: 'https://miniso.pk/products/professional-ear-picks-set-6-pcs'
        },
        {
          name: 'Hello Kitty Red False Nails with Jelly Tabs',
          currentPrice: 'PKR 550',
          originalPrice: 'PKR 850',
          discount: '35% Off',
          image: 'https://cdn.shopify.com/s/files/1/0500/8539/6644/files/6957389500949-1.jpg?v=1765542995',
          url: 'https://miniso.pk/products/hello-kitty-red-false-nails-with-jelly-adhesive-tabs'
        }
      ]
    }
  },
  {
    id: 'saeed-ghani',
    name: 'Saeed Ghani',
    category: 'Lifestyle',
    url: 'https://saeedghani.pk',
    color: '#2E7D32',
    status: 'sale',
    featured: false,
    live: { off: 'Up to 30% Off' },
    sale: {
      headline: 'Pure Herbal Glow Sale - Up to 30% Off',
      sourceUrl: 'https://saeedghani.pk/collections/sale',
      products: [
        {
          name: 'Haider Discovery Set Mini Scent Deal',
          currentPrice: 'PKR 800',
          originalPrice: 'PKR 1,200',
          discount: '33% Off',
          image: 'https://cdn.shopify.com/s/files/1/0434/3604/8550/files/HaiderTestersDealWebcopy.webp?v=1789993217',
          url: 'https://saeedghani.pk/products/haider-discovery-sethaider-mini-scent-deal'
        },
        {
          name: 'Super Bright Dark Circle Under Eye Cream',
          currentPrice: 'PKR 800',
          originalPrice: 'PKR 1,150',
          discount: '30% Off',
          image: 'https://cdn.shopify.com/s/files/1/0434/3604/8550/files/SuperBrightDarkCircleUnderEyeCream.webp?v=1789550877',
          url: 'https://saeedghani.pk/products/super-bright-dark-circle-under-eye-cream'
        }
      ]
    }
  },
  {
    id: 'hub-leather',
    name: 'Hub Leather',
    category: 'Bags',
    url: 'https://hub.com.pk',
    color: '#5D4037',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 20% Off' },
    sale: {
      headline: 'Handcrafted Heritage - Flat 20% Off Leather Goods',
      sourceUrl: 'https://hub.com.pk',
      products: [
        {
          name: 'Clover Handcrafted Leather Handbag - Papaya',
          currentPrice: 'PKR 15,900',
          originalPrice: 'PKR 19,800',
          discount: '20% Off',
          image: 'https://cdn.shopify.com/s/files/1/0535/0506/5136/files/LW070B-007_6.jpg?v=1757147156',
          url: 'https://hub.com.pk/products/lw070b-007'
        },
        {
          name: 'Utile Genuine Leather Shoulder Bag - Beige',
          currentPrice: 'PKR 13,500',
          originalPrice: 'PKR 16,900',
          discount: '20% Off',
          image: 'https://cdn.shopify.com/s/files/1/0535/0506/5136/files/LB0146-008_1.jpg?v=1757147187',
          url: 'https://hub.com.pk/products/lb0146-008'
        }
      ]
    }
  },
  {
    id: 'jafferjees',
    name: 'Jafferjees',
    category: 'Bags',
    url: 'https://jafferjees.com',
    color: '#3E2723',
    status: 'new',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'sonashi-pk',
    name: 'Sonashi & Chef',
    category: 'Kitchen & Accessories',
    url: 'https://chefcookware.com',
    color: '#0288D1',
    status: 'normal',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'limelight',
    name: 'Limelight',
    category: 'Clothing',
    url: 'https://www.limelight.pk',
    color: '#111111',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 50% Off' },
    sale: {
      headline: 'Mid-Season Flash Sale - Up to 50% Off',
      sourceUrl: 'https://www.limelight.pk/collections/sale',
      products: [
        {
          name: 'Embroidered Jacquard 2-Piece Suit',
          currentPrice: 'PKR 3,499',
          originalPrice: 'PKR 4,999',
          discount: '30% Off',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
          url: 'https://www.limelight.pk/collections/sale'
        },
        {
          name: 'Printed Lawn Shirt Kurti',
          currentPrice: 'PKR 1,599',
          originalPrice: 'PKR 2,499',
          discount: '36% Off',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
          url: 'https://www.limelight.pk/collections/sale'
        }
      ]
    }
  },
  {
    id: 'generation',
    name: 'Generation',
    category: 'Clothing',
    url: 'https://generation.com.pk',
    color: '#E64A19',
    status: 'new',
    featured: true,
    live: { off: 'Fresh Drop 2026' },
    sale: null
  },
  {
    id: 'bonanza-satrangi',
    name: 'Bonanza Satrangi',
    category: 'Clothing',
    url: 'https://bonanzasatrangi.com',
    color: '#58111A',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 30% Off' },
    sale: {
      headline: 'Grand Festive Sale - Flat 30% & 50% Off',
      sourceUrl: 'https://bonanzasatrangi.com/collections/sale',
      products: [
        {
          name: 'Lawn Unstitched 3-Piece Floral Suit',
          currentPrice: 'PKR 3,290',
          originalPrice: 'PKR 4,700',
          discount: '30% Off',
          image: 'https://images.unsplash.com/photo-1583391733975-021020475850?w=600&auto=format&fit=crop&q=80',
          url: 'https://bonanzasatrangi.com/collections/sale'
        },
        {
          name: 'Classic Men Cotton Kurta',
          currentPrice: 'PKR 2,750',
          originalPrice: 'PKR 3,950',
          discount: '30% Off',
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
          url: 'https://bonanzasatrangi.com/collections/sale'
        }
      ]
    }
  },
  {
    id: 'zellbury',
    name: 'Zellbury',
    category: 'Clothing',
    url: 'https://zellbury.com',
    color: '#1A1A1A',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 20% & 40% Off' },
    sale: {
      headline: 'Super Saver Sale - Flat 20% & 40% Off',
      sourceUrl: 'https://zellbury.com/collections/sale',
      products: [
        {
          name: 'Printed Lawn 3PC Unstitched Suit',
          currentPrice: 'PKR 2,690',
          originalPrice: 'PKR 3,690',
          discount: '27% Off',
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
          url: 'https://zellbury.com/collections/sale'
        },
        {
          name: 'Ready To Wear Solid Kurti',
          currentPrice: 'PKR 1,490',
          originalPrice: 'PKR 1,990',
          discount: '25% Off',
          image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80',
          url: 'https://zellbury.com/collections/sale'
        }
      ]
    }
  },
  {
    id: 'beechtree',
    name: 'BeechTree',
    category: 'Clothing',
    url: 'https://beechtree.pk',
    color: '#0D3B33',
    status: 'new',
    featured: true,
    live: { off: 'Spring/Summer Pret' },
    sale: null
  },
  {
    id: 'edenrobe',
    name: 'Edenrobe',
    category: 'Clothing',
    url: 'https://edenrobe.com',
    color: '#78141F',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 50% Off' },
    sale: {
      headline: 'End of Season Bonanza - Up to 50% Off',
      sourceUrl: 'https://edenrobe.com/collections/sale',
      products: [
        {
          name: 'Men Wash & Wear Unstitched Suit',
          currentPrice: 'PKR 3,450',
          originalPrice: 'PKR 5,750',
          discount: '40% Off',
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
          url: 'https://edenrobe.com/collections/sale'
        },
        {
          name: 'Women Stitched Pret Kurti',
          currentPrice: 'PKR 1,990',
          originalPrice: 'PKR 3,290',
          discount: '39% Off',
          image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
          url: 'https://edenrobe.com/collections/sale'
        }
      ]
    }
  },
  {
    id: 'ecs',
    name: 'ECS',
    category: 'Footwear',
    url: 'https://shopecs.com',
    color: '#B31317',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 20% & 50% Off' },
    sale: {
      headline: 'Footwear Craze - Flat 20% & 50% Off',
      sourceUrl: 'https://shopecs.com/collections/sale',
      products: [
        {
          name: 'Traditional Embellished Khussa',
          currentPrice: 'PKR 2,450',
          originalPrice: 'PKR 3,500',
          discount: '30% Off',
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
          url: 'https://shopecs.com/collections/sale'
        },
        {
          name: 'Chic Block Heel Formal Sandals',
          currentPrice: 'PKR 3,190',
          originalPrice: 'PKR 4,990',
          discount: '36% Off',
          image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&auto=format&fit=crop&q=80',
          url: 'https://shopecs.com/collections/sale'
        }
      ]
    }
  },
  {
    id: 'insignia',
    name: 'Insignia',
    category: 'Footwear',
    url: 'https://insignia.com.pk',
    color: '#141414',
    status: 'sale',
    featured: false,
    live: { off: 'Up to 40% Off' },
    sale: {
      headline: 'Luxury Season Sale - Up to 40% Off',
      sourceUrl: 'https://insignia.com.pk/collections/sale',
      products: [
        {
          name: 'Premium Bridal Pointed Pumps',
          currentPrice: 'PKR 6,490',
          originalPrice: 'PKR 9,990',
          discount: '35% Off',
          image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&auto=format&fit=crop&q=80',
          url: 'https://insignia.com.pk/collections/sale'
        },
        {
          name: 'Structured Luxury Evening Clutch',
          currentPrice: 'PKR 4,990',
          originalPrice: 'PKR 7,500',
          discount: '33% Off',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
          url: 'https://insignia.com.pk/collections/sale'
        }
      ]
    }
  },
  {
    id: 'first-step',
    name: '1st Step',
    category: 'Footwear',
    url: 'https://1ststep.pk',
    color: '#C92A2A',
    status: 'normal',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'interwood',
    name: 'Interwood',
    category: 'Home Décor',
    url: 'https://interwood.pk',
    color: '#1B3B2B',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 30% Off' },
    sale: {
      headline: 'Home Makeover Sale - Up to 30% Off Living & Bedrooms',
      sourceUrl: 'https://interwood.pk/sale',
      products: [
        {
          name: 'Ergonomic Executive Office Chair',
          currentPrice: 'PKR 28,500',
          originalPrice: 'PKR 38,000',
          discount: '25% Off',
          image: 'https://images.unsplash.com/photo-1580481077195-c546312a1492?w=600&auto=format&fit=crop&q=80',
          url: 'https://interwood.pk/sale'
        },
        {
          name: 'Contemporary Coffee Table - Solid Oak',
          currentPrice: 'PKR 22,000',
          originalPrice: 'PKR 31,500',
          discount: '30% Off',
          image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80',
          url: 'https://interwood.pk/sale'
        }
      ]
    }
  },
  {
    id: 'dolce-vita-home',
    name: 'Dolce Vita Home',
    category: 'Home Décor',
    url: 'https://dolcevitahome.com.pk',
    color: '#212529',
    status: 'normal',
    featured: false,
    live: null,
    sale: null
  },
  {
    id: 'hemani',
    name: 'Hemani Herbals',
    category: 'Lifestyle',
    url: 'https://hemanicherbals.pk',
    color: '#1B5E20',
    status: 'sale',
    featured: false,
    live: { off: 'Flat 25% Off' },
    sale: {
      headline: 'Wellness & Herbal Care - Flat 25% Off',
      sourceUrl: 'https://hemanicherbals.pk/sale',
      products: [
        {
          name: 'Pure Organic Black Seed Oil 100ml',
          currentPrice: 'PKR 950',
          originalPrice: 'PKR 1,250',
          discount: '24% Off',
          image: 'https://images.unsplash.com/photo-1608248597359-bbad5e7a9b09?w=600&auto=format&fit=crop&q=80',
          url: 'https://hemanicherbals.pk/sale'
        },
        {
          name: 'Natural Rose Water Spray Mist 120ml',
          currentPrice: 'PKR 380',
          originalPrice: 'PKR 500',
          discount: '24% Off',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
          url: 'https://hemanicherbals.pk/sale'
        }
      ]
    }
  },
  {
    id: 'cross-stitch',
    name: 'Cross Stitch',
    category: 'Clothing',
    url: 'https://crossstitch.pk',
    color: '#2D3748',
    status: 'sale',
    featured: true,
    live: { off: 'Up to 40% Off' },
    sale: {
      headline: 'Embroidered Luxury Clearance - Up to 40% Off',
      sourceUrl: 'https://crossstitch.pk/collections/sale',
      products: [
        {
          name: 'Embroidered Swiss Voile 3PC Suit',
          currentPrice: 'PKR 5,490',
          originalPrice: 'PKR 8,990',
          discount: '39% Off',
          image: 'https://images.unsplash.com/photo-1610030469668-932d0c64517b?w=600&auto=format&fit=crop&q=80',
          url: 'https://crossstitch.pk/collections/sale'
        },
        {
          name: 'Chiffon Dupatta Luxury Ensemble',
          currentPrice: 'PKR 6,250',
          originalPrice: 'PKR 9,500',
          discount: '34% Off',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
          url: 'https://crossstitch.pk/collections/sale'
        }
      ]
    }
  },
  {
    id: 'kayseria',
    name: 'Kayseria',
    category: 'Clothing',
    url: 'https://kayseria.com',
    color: '#781D26',
    status: 'sale',
    featured: true,
    live: { off: 'Flat 30% Off' },
    sale: {
      headline: 'Magic In Prints Sale - Flat 30% Off',
      sourceUrl: 'https://kayseria.com/collections/sale',
      products: [
        {
          name: 'Heritage Traditional Printed Lawn 3PC',
          currentPrice: 'PKR 3,790',
          originalPrice: 'PKR 5,450',
          discount: '30% Off',
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
          url: 'https://kayseria.com/collections/sale'
        },
        {
          name: 'Classic Vintage Printed Kurti',
          currentPrice: 'PKR 1,890',
          originalPrice: 'PKR 2,700',
          discount: '30% Off',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
          url: 'https://kayseria.com/collections/sale'
        }
      ]
    }
  }
];

if (typeof window !== 'undefined') {
  window.BRANDS = BRANDS;
  window.loadSalesStatus = loadSalesStatus;
}

function getInitials(name) {
  if (!name) return 'BG';
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const BRAND_LOGOS = {
  'khaadi': '/assets/logos/khaadi.svg',
  'sapphire': '/assets/logos/sapphire.svg',
  'gul-ahmed': '/assets/logos/gul-ahmed.webp',
  'j-junaid-jamshed': '/assets/logos/j-junaid-jamshed.svg',
  'outfitters': '/assets/logos/outfitters.svg',
  'nishat-linen': '/assets/logos/nishat-linen.png',
  'alkaram-studio': '/assets/logos/alkaram-studio.png',
  'sana-safinaz': '/assets/logos/sana-safinaz.png',
  'maria-b': '/assets/logos/maria-b.svg',
  'breakout': '/assets/logos/breakout.svg',
  'charcoal': '/assets/logos/charcoal.png',
  'stylo': '/assets/logos/stylo.svg',
  'servis': '/assets/logos/servis.png',
  'ndure': '/assets/logos/ndure.svg',
  'borjan': '/assets/logos/borjan.png',
  'bata-pk': '/assets/logos/bata-pk.png',
  'habitt': '/assets/logos/habitt.webp',
  'ideas-home': '/assets/logos/ideas-home.webp',
  'chenone': '/assets/logos/chenone.png',
  'miniso-pk': '/assets/logos/miniso-pk.png',
  'saeed-ghani': '/assets/logos/saeed-ghani.png',
  'hub-leather': '/assets/logos/hub-leather.png',
  'jafferjees': '/assets/logos/jafferjees.png',
  'sonashi-pk': '/assets/logos/sonashi-pk.svg',
  'limelight': '/assets/logos/limelight.svg',
  'generation': '/assets/logos/generation.svg',
  'bonanza-satrangi': '/assets/logos/bonanza-satrangi.svg',
  'zellbury': '/assets/logos/zellbury.svg',
  'beechtree': '/assets/logos/beechtree.svg',
  'edenrobe': '/assets/logos/edenrobe.svg',
  'ecs': '/assets/logos/ecs.svg',
  'insignia': '/assets/logos/insignia.svg',
  'first-step': '/assets/logos/first-step.svg',
  'interwood': '/assets/logos/interwood.svg',
  'dolce-vita-home': '/assets/logos/dolce-vita-home.svg',
  'hemani': '/assets/logos/hemani.svg',
  'cross-stitch': '/assets/logos/cross-stitch.svg',
  'kayseria': '/assets/logos/kayseria.svg'
};

function getBrandLogo(b) {
  if (!b) return '';
  if (b.logo) return b.logo;
  if (typeof BRAND_LOGOS !== 'undefined' && BRAND_LOGOS[b.id]) return BRAND_LOGOS[b.id];
  return '';
}

function brandBadgeHTML(b, size) {
  if (!b) return '';
  const s = size || 44;
  const logo = getBrandLogo(b);
  const initials = getInitials(b.name);
  const color = b.color || '#1B2A5E';
  const fontSize = Math.max(9, Math.round(s * 0.35));
  const pad = Math.max(2, Math.round(s * 0.08));

  if (logo) {
    return `<div class="brand-badge brand-logo-badge" style="width:${s}px;height:${s}px;min-width:${s}px;border-radius:50%;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.12);border:1px solid rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;padding:${pad}px;overflow:hidden;flex-shrink:0;">` +
      `<img src="${logo}" alt="${b.name}" loading="lazy" style="max-width:82%;max-height:82%;object-fit:contain;display:block;" onerror="this.style.display='none';if(this.nextElementSibling){this.nextElementSibling.style.display='flex';}">` +
      `<span class="brand-badge-fallback" style="display:none;width:100%;height:100%;background:${color};border-radius:50%;align-items:center;justify-content:center;font-size:${fontSize}px;color:#fff;font-weight:800;">${initials}</span>` +
    `</div>`;
  }

  return `<div class="brand-badge" style="width:${s}px;height:${s}px;min-width:${s}px;background:${color};font-size:${fontSize}px;">${initials}</div>`;
}

function getFollowedBrands() {
  if (window.BrandGaliAuth && typeof window.BrandGaliAuth.getFollowedBrands === 'function') {
    return window.BrandGaliAuth.getFollowedBrands();
  }
  try {
    return JSON.parse(localStorage.getItem('brandgali_following') || '[]');
  } catch(e) {
    return [];
  }
}

function isFollowing(brandId) {
  if (window.BrandGaliAuth) {
    if (!window.BrandGaliAuth.getCurrentUser()) {
      return false;
    }
    if (typeof window.BrandGaliAuth.isFollowing === 'function') {
      return window.BrandGaliAuth.isFollowing(brandId);
    }
  }
  return false;
}

function notifyButtonHTML(b) {
  const following = isFollowing(b.id);
  const cls = following ? 'notify-btn following' : 'notify-btn';
  const icon = following ? 'fa-solid fa-check' : 'fa-regular fa-bell';
  const label = following ? 'Following' : 'Notify';
  return `<button class="${cls}" data-brand-id="${b.id}" data-brand-name="${b.name}" aria-label="Toggle sale alerts for ${b.name}"><i class="${icon}"></i> <span>${label}</span></button>`;
}

function wireNotifyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.notify-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const brandId = btn.dataset.brandId;
    if (!brandId) return;
    const brandName = btn.dataset.brandName || brandId;

    if (window.BrandGaliAuth) {
      if (!window.BrandGaliAuth.getCurrentUser()) {
        window.BrandGaliAuth.openAuthModal(brandId, brandName);
        return;
      }
      window.BrandGaliAuth.toggleBrandNotification(brandId, brandName);
      return;
    }
  });
}

function refreshNotifyButtonsUI() {
  const list = getFollowedBrands();
  document.querySelectorAll('.notify-btn').forEach(btn => {
    const id = btn.dataset.brandId;
    if (list.includes(id)) {
      btn.classList.add('following');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Following</span>';
    } else {
      btn.classList.remove('following');
      btn.innerHTML = '<i class="fa-regular fa-bell"></i> <span>Notify</span>';
    }
  });
}

function showToast(message) {
  let toast = document.getElementById('bgToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bgToast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function parsePriceValue(priceStr) {
  if (!priceStr) return 0;
  const num = parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

function getProductSpecs(brand, product, productIndex) {
  const currNum = parsePriceValue(product.currentPrice);
  const origNum = parsePriceValue(product.originalPrice);
  const savingsNum = (origNum && currNum && origNum > currNum) ? (origNum - currNum) : 0;
  const discountPct = (origNum && savingsNum)
    ? Math.round((savingsNum / origNum) * 100) + '% OFF'
    : (product.discount || (brand.live && brand.live.off) || 'Special Sale');

  const savingsFormatted = savingsNum ? 'PKR ' + savingsNum.toLocaleString('en-PK') : (product.discount || '');

  const name = product.name || 'Official Brand Item';
  let defaultFabric = 'Premium Quality Blend';
  if (name.includes('Jacquard')) defaultFabric = 'Premium Woven Jacquard';
  else if (name.includes('Lawn')) defaultFabric = 'Fine Spun Swiss Lawn';
  else if (name.includes('Velvet')) defaultFabric = 'Plush Velvet Silk Blend';
  else if (name.includes('Cotton') || name.includes('Cambric')) defaultFabric = '100% Breathable Combed Cotton';
  else if (name.includes('Denim')) defaultFabric = 'Durable Washed Cotton Denim';
  else if (name.includes('Linen')) defaultFabric = 'Pure Textured Linen';
  else if (name.includes('Leather')) defaultFabric = 'Genuine Handcrafted Leather';
  else if (name.includes('Silk') || name.includes('Chiffon')) defaultFabric = 'Pure Silk / Chiffon';
  else if (brand.category === 'Footwear') defaultFabric = 'Ergonomic Cushion Insole & Traction Sole';
  else if (brand.category === 'Home Décor') defaultFabric = 'Durable Luxury Home Textiles';
  else if (brand.category === 'Lifestyle') defaultFabric = 'Tested Hypoallergenic Materials';

  let defaultType = brand.category;
  if (name.includes('2-Piece') || name.includes('2PC')) defaultType = '2-Piece Stitched (Shirt + Trousers)';
  else if (name.includes('3-Piece') || name.includes('3PC')) defaultType = '3-Piece Ensemble (Shirt + Trousers + Dupatta)';
  else if (name.includes('Kurti') || name.includes('Kurta')) defaultType = 'Stitched Classic Kurta';
  else if (name.includes('Shoes') || name.includes('Sneakers') || name.includes('Khussa')) defaultType = 'Footwear Collection';

  let defaultSizes = ['Standard / All Sizes'];
  if (brand.category === 'Clothing') defaultSizes = ['XS', 'S', 'M', 'L', 'XL'];
  else if (brand.category === 'Footwear') defaultSizes = ['38 (7)', '39 (8)', '40 (9)', '41 (10)', '42 (11)'];

  const officialUrl = product.url || (brand.sale && brand.sale.sourceUrl) || brand.url;

  return {
    name,
    currNum,
    origNum,
    savingsNum,
    savingsFormatted,
    discountPct,
    fabric: product.fabric || defaultFabric,
    type: product.type || defaultType,
    sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes : defaultSizes,
    sku: product.sku || ('BG-' + (brand.id || 'GEN').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() + '-' + (2100 + (productIndex || 0) * 117)),
    description: product.description || (`Official sale item from ${brand.name}. Currently featured in the ${brand.sale && brand.sale.headline ? brand.sale.headline : 'current collection'} with verified seasonal discount across official stores.`),
    delivery: brand.delivery || '3-5 Business Days',
    shipping: brand.shipping || 'Standard nationwide delivery across Pakistan',
    returns: brand.returns || 'Easy exchange policy at official brand outlets & online',
    payment: 'Cash on Delivery (COD) & Online Cards Supported',
    officialUrl
  };
}

function openBrandSaleModal(brandId) {
  const brand = BRANDS.find(b => b.id === brandId);
  if (!brand) return;

  let modal = document.getElementById('brandSaleModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'brandSaleModal';
    modal.className = 'brand-sale-modal';
    document.body.appendChild(modal);
  }

  const sale = brand.sale || {};
  const hasSale = brand.status === 'sale' || Boolean(brand.live) || Boolean(sale.headline || (Array.isArray(sale.products) && sale.products.length));
  const products = Array.isArray(sale.products) ? sale.products.filter(p => p && (p.name || p.image)) : [];
  const headline = sale.headline || (brand.live && brand.live.off) || 'Active Sale Live Now';
  const urgency = sale.urgency ? `<span class="urgency-tag" style="font-size:10px;padding:2px 7px;border-radius:6px;background:#FDE8E8;color:#D5473F;font-weight:700;"><i class="fa-solid fa-stopwatch"></i> ${sale.urgency}</span>` : '';

  let saleContentHTML = '';

  if (hasSale) {
    const productsHTML = products.length ? `
      <div class="sale-modal-products" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 0 14px;">
        ${products.map((p, idx) => {
          const specs = getProductSpecs(brand, p, idx);
          const pImg = p.image ? `
            <div style="position:relative;background:#F0F1F4;">
              <img src="${p.image}" alt="${(p.name || '').replace(/"/g,'&quot;')}" loading="lazy" style="width:100%;height:115px;object-fit:cover;border-top-left-radius:10px;border-top-right-radius:10px;display:block;">
              <span style="position:absolute;bottom:6px;right:6px;background:rgba(18,24,58,0.85);color:#fff;font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:4px;display:flex;align-items:center;gap:4px;">
                <i class="fa-solid fa-eye"></i> Details
              </span>
            </div>` : `<div style="height:115px;background:#E8EBF2;display:grid;place-items:center;color:var(--muted);"><i class="fa-solid fa-bag-shopping" style="font-size:24px;"></i></div>`;
          const pPrice = p.currentPrice ? `<div style="font-size:12px;font-weight:800;color:var(--orange-deep);">${p.currentPrice} ${p.originalPrice ? `<span style="font-size:10px;color:var(--muted);text-decoration:line-through;font-weight:400;margin-left:4px;">${p.originalPrice}</span>` : ''}</div>` : '';
          const pDisc = specs.discountPct ? `<span style="font-size:9.5px;background:#FDEBD3;color:var(--orange-deep);padding:2px 6px;border-radius:4px;font-weight:700;margin-top:2px;display:inline-block;">${specs.discountPct}</span>` : '';
          return `
            <div class="product-card interactive" onclick="openProductDetailModal('${brand.id}', ${idx}, true)" role="button" tabindex="0" title="Tap to view item details on BrandGali" aria-label="View details for ${p.name || 'item'}" style="text-align:left;cursor:pointer;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;">
              ${pImg}
              <div style="padding:8px 9px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="font-size:11.5px;font-weight:700;color:var(--navy);line-height:1.25;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${p.name || 'Sale Item'}</div>
                </div>
                <div>
                  ${pPrice}
                  ${pDisc}
                  <div class="card-click-hint" style="margin-top:5px;">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>In-App Details</span>
                    <i class="fa-solid fa-arrow-right" style="margin-left:auto;font-size:8px;"></i>
                  </div>
                  <a href="${p.url || specs.officialUrl}" target="_blank" rel="noopener" class="direct-product-link" onclick="event.stopPropagation();" title="Go directly to ${p.name || 'item'} on official ${brand.name} store">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Direct Store Link
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div style="margin:12px 0;padding:14px;background:#F5F6FA;border-radius:12px;border:1px solid var(--line);text-align:center;">
        <div style="font-size:22px;color:var(--orange-deep);margin-bottom:6px;"><i class="fa-solid fa-bag-shopping"></i></div>
        <strong style="display:block;font-size:13.5px;color:var(--navy);margin-bottom:4px;">Official Store Sale is Live</strong>
        <p style="font-size:12px;color:var(--muted);margin:0 0 12px;line-height:1.4;">${sale.note || "Live sale discounts are currently running across official " + brand.name + " collections."}</p>
        <a href="${(brand.sale && brand.sale.sourceUrl) || brand.url}" target="_blank" rel="noopener" class="btn" style="background:var(--orange);color:#fff;padding:8px 16px;border-radius:8px;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:700;">
          Shop Sale on ${brand.name} Store &rarr;
        </a>
      </div>
    `;

    saleContentHTML = `
      <div style="background:#FFF9F2;border:1px solid #FDEBD3;padding:12px 14px;border-radius:12px;margin:10px 0 12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;margin-bottom:4px;">
          <span style="font-family:'Poppins',sans-serif;font-size:15px;font-weight:800;color:var(--orange-deep);display:flex;align-items:center;gap:6px;">
            <i class="fa-solid fa-fire"></i> ${headline}
          </span>
          ${urgency}
        </div>
        <div style="font-size:11.5px;color:var(--muted);display:flex;align-items:center;gap:8px;">
          <span class="deal-verified-pill"><i class="fa-solid fa-circle-check"></i> Verified Today</span>
          <span>&bull;</span>
          <span>Delivery: ${brand.delivery || '3-5 Days'}</span>
          <span>&bull;</span>
          <span>COD Supported</span>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;margin-bottom:4px;">
        <div style="font-size:12.5px;font-weight:700;color:var(--navy);">
          <i class="fa-solid fa-tags" style="color:var(--orange-deep);margin-right:4px;"></i> Active Sale Deals ${products.length ? `(${products.length} Featured Items)` : ''}
        </div>
        <a href="live-sales.html?brand=${brand.id}" style="font-size:11px;font-weight:700;color:var(--orange-deep);text-decoration:none;">View Full Feed &rarr;</a>
      </div>

      ${products.length ? `<p style="font-size:11px;color:var(--muted);margin:2px 0 8px;">Tap any item to see full specifications, fabric, sizes, and savings before visiting the store:</p>` : ''}

      ${productsHTML}

      <div style="display:flex;gap:8px;margin-top:14px;">
        <a class="btn" href="live-sales.html?brand=${brand.id}" style="flex:1;text-align:center;background:var(--navy);padding:11px 12px;font-size:12px;border-radius:10px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;color:#fff;">
          <i class="fa-solid fa-list-check"></i> View on Live Sales Page
        </a>
        ${notifyButtonHTML(brand)}
      </div>

      <div style="text-align:center;margin-top:12px;padding-top:10px;border-top:1px solid var(--line);">
        <a href="${(brand.sale && brand.sale.sourceUrl) || brand.url}" target="_blank" rel="noopener" style="font-size:11.5px;color:var(--navy);font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
          <span>Visit official ${brand.name} store</span> <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px;"></i>
        </a>
      </div>
    `;
  } else {
    // Brand has NO active sale currently
    saleContentHTML = `
      <div style="background:#FAF8F5;border:1px solid var(--line);border-radius:14px;padding:24px 18px;text-align:center;margin:14px 0;">
        <div style="width:48px;height:48px;border-radius:50%;background:#EDE8DF;display:grid;place-items:center;margin:0 auto 12px;color:var(--muted);font-size:22px;">
          <i class="fa-solid fa-tags"></i>
        </div>
        <h4 style="font-family:'Poppins',sans-serif;font-size:15.5px;font-weight:800;color:var(--navy);margin:0 0 6px;">No Live Sale Right Now</h4>
        <p style="font-size:12.5px;color:var(--muted);line-height:1.45;margin:0 0 16px;max-width:360px;margin-left:auto;margin-right:auto;">
          ${brand.name} is currently selling at standard retail catalog prices. We verify brand discounts daily. Follow ${brand.name} below to get an instant alert the minute their next sale drops!
        </p>
        <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;align-items:center;">
          ${notifyButtonHTML(brand)}
          <a class="btn" href="${brand.url}" target="_blank" rel="noopener" style="background:#fff;border:1px solid var(--line);color:var(--navy);font-size:12px;padding:8px 16px;border-radius:10px;text-decoration:none;font-weight:700;">
            Visit Store Site &rarr;
          </a>
        </div>
      </div>
      <div style="text-align:center;margin-top:12px;">
        <a href="live-sales.html" class="btn" style="background:var(--navy);color:#fff;padding:9px 18px;border-radius:8px;font-size:12px;text-decoration:none;font-weight:700;display:inline-flex;align-items:center;gap:6px;">
          <i class="fa-solid fa-fire" style="color:var(--orange);"></i> Browse Brands On Sale Today &rarr;
        </a>
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="brand-sale-dialog">
      <div class="modal-drag-handle"></div>
      <div class="sale-modal-head">
        ${brandBadgeHTML(brand, 48)}
        <div style="flex:1;">
          <div style="font-family:'Poppins';font-weight:800;font-size:17px;color:var(--navy);display:flex;align-items:center;gap:6px;">
            ${brand.name}
            <i class="fa-solid fa-circle-check" style="font-size:13px;color:#0B7D68;" title="Verified Store"></i>
          </div>
          <div style="font-size:11.5px;color:var(--muted);">${brand.category} &bull; ${brand.priceRange || 'Retail Brand'}</div>
        </div>
        <button class="sale-modal-close" onclick="closeBrandSaleModal()" aria-label="Close">&times;</button>
      </div>

      ${saleContentHTML}
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  wireNotifyButtons();

  modal.onclick = (e) => {
    if (e.target === modal) closeBrandSaleModal();
  };
}

function closeBrandSaleModal() {
  const modal = document.getElementById('brandSaleModal');
  if (modal) {
    modal.classList.remove('open');
  }
  const detailModal = document.getElementById('productDetailModal');
  if (!detailModal || !detailModal.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

// -------------------------------------------------------------
// In-App Product Detail Modal (View and Copy Item Details)
// -------------------------------------------------------------
function openProductDetailModal(brandId, productIndex, returnToSaleModal) {
  const brand = BRANDS.find(b => b.id === brandId);
  if (!brand) return;

  const sale = brand.sale || {};
  const products = Array.isArray(sale.products) ? sale.products : [];
  const product = products[productIndex] || products[0];
  if (!product) return;

  const specs = getProductSpecs(brand, product, productIndex);

  let modal = document.getElementById('productDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'productDetailModal';
    modal.className = 'product-detail-modal';
    document.body.appendChild(modal);
  }

  // If opened from the brand sale modal, temporarily hide it behind this detail view
  const brandModal = document.getElementById('brandSaleModal');
  if (brandModal && returnToSaleModal) {
    brandModal.style.visibility = 'hidden';
  }

  const sizesHTML = specs.sizes.map((sz, i) =>
    `<span class="size-chip${i === 0 ? ' active' : ''}">${sz}</span>`
  ).join('');

  const hasOutlets = BRAND_PHYSICAL_STORES && BRAND_PHYSICAL_STORES[brand.id];

  modal.innerHTML = `
    <div class="product-detail-dialog">
      <div class="modal-drag-handle"></div>

      <div class="modal-nav-bar">
        ${returnToSaleModal ? `
          <button type="button" class="modal-back-btn" onclick="closeProductDetailModal(true)">
            <i class="fa-solid fa-arrow-left"></i> Back to ${brand.name} Sale
          </button>
        ` : `
          <span style="font-size:12px;font-weight:700;color:var(--navy);display:flex;align-items:center;gap:6px;">
            <i class="fa-solid fa-bag-shopping" style="color:var(--orange-deep);"></i> Item Details
          </span>
        `}
        <button class="sale-modal-close" onclick="closeProductDetailModal(false)" aria-label="Close">&times;</button>
      </div>

      <div class="product-detail-brand-bar">
        ${brandBadgeHTML(brand, 38)}
        <div style="flex:1;">
          <div style="font-family:'Poppins';font-weight:700;font-size:13.5px;color:var(--navy);">${brand.name}</div>
          <div style="font-size:11px;color:var(--muted);">${brand.category} &bull; ${brand.priceRange || 'Official Retailer'}</div>
        </div>
        ${notifyButtonHTML(brand)}
      </div>

      <div class="product-detail-hero">
        ${product.image ? `<img src="${product.image}" alt="${specs.name.replace(/"/g,'&quot;')}" loading="eager">` : `<i class="fa-solid fa-bag-shopping" style="font-size:42px;color:var(--muted);"></i>`}
        ${specs.savingsNum ? `<div class="product-hero-badge"><i class="fa-solid fa-fire"></i> Save ${specs.savingsFormatted}</div>` : (specs.discountPct ? `<div class="product-hero-badge">${specs.discountPct}</div>` : '')}
        <div class="product-hero-verified">
          <i class="fa-solid fa-circle-check" style="color:#34D399;"></i> Verified Brand Item
        </div>
      </div>

      <h3 style="font-family:'Poppins';font-weight:800;font-size:18px;color:var(--navy);margin:6px 0 2px;line-height:1.3;">
        ${specs.name}
      </h3>
      <div style="font-size:11.5px;color:var(--orange-deep);font-weight:700;margin-bottom:8px;">
        <i class="fa-solid fa-tag"></i> Active Offer: ${sale.headline || (brand.live && brand.live.off) || 'Seasonal Special Discount'}
      </div>

      <div class="product-detail-price-box">
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted);font-weight:700;">Official Sale Price</div>
          <div style="font-size:22px;font-weight:800;color:var(--orange-deep);line-height:1.1;margin-top:2px;">
            ${product.currentPrice || 'Discounted'}
            ${product.originalPrice ? `<span style="font-size:13px;color:var(--muted);text-decoration:line-through;font-weight:500;margin-left:6px;">${product.originalPrice}</span>` : ''}
          </div>
        </div>
        ${specs.savingsNum ? `
          <div style="background:#FDE68A;color:#92400E;padding:6px 10px;border-radius:8px;font-size:11.5px;font-weight:800;text-align:right;">
            <i class="fa-solid fa-bolt"></i> ${specs.discountPct}
            <div style="font-size:10px;font-weight:600;">You Save ${specs.savingsFormatted}</div>
          </div>
        ` : ''}
      </div>

      <p style="font-size:12.5px;color:#4B5563;line-height:1.5;margin:10px 0 12px;">
        ${specs.description}
      </p>

      <div class="copy-details-bar">
        <div style="font-size:11.5px;color:var(--navy);font-weight:600;display:flex;align-items:center;gap:6px;">
          <i class="fa-regular fa-clipboard" style="color:var(--orange-deep);"></i>
          <span>Copy full details & link:</span>
        </div>
        <button type="button" class="btn" onclick="copyProductDetails('${brand.id}', ${productIndex})" style="padding:7px 12px;font-size:11px;background:#fff;color:var(--navy);border:1px solid var(--line);display:inline-flex;align-items:center;gap:5px;">
          <i class="fa-regular fa-copy"></i> Copy Info
        </button>
      </div>

      <div class="product-detail-specs">
        <div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.04em;">
          Item Specifications & Details
        </div>
        <div class="spec-row">
          <span class="spec-label"><i class="fa-solid fa-layer-group" style="margin-right:5px;color:var(--teal-deep);"></i> Collection / Cut:</span>
          <span class="spec-value">${specs.type}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label"><i class="fa-solid fa-shirt" style="margin-right:5px;color:var(--teal-deep);"></i> Fabric / Composition:</span>
          <span class="spec-value">${specs.fabric}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label"><i class="fa-solid fa-barcode" style="margin-right:5px;color:var(--teal-deep);"></i> SKU Code:</span>
          <span class="spec-value" style="font-family:monospace;letter-spacing:0.04em;">${specs.sku}</span>
        </div>
        <div class="spec-row" style="flex-direction:column;align-items:flex-start;gap:4px;">
          <span class="spec-label"><i class="fa-solid fa-ruler" style="margin-right:5px;color:var(--teal-deep);"></i> Available Sizes:</span>
          <div class="size-chips-row">${sizesHTML}</div>
        </div>
        <div class="spec-row">
          <span class="spec-label"><i class="fa-solid fa-truck-fast" style="margin-right:5px;color:var(--teal-deep);"></i> Nationwide Shipping:</span>
          <span class="spec-value">${specs.shipping}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label"><i class="fa-solid fa-clock" style="margin-right:5px;color:var(--teal-deep);"></i> Delivery Timeline:</span>
          <span class="spec-value">${specs.delivery}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label"><i class="fa-solid fa-rotate-left" style="margin-right:5px;color:var(--teal-deep);"></i> Returns & Exchanges:</span>
          <span class="spec-value">${specs.returns}</span>
        </div>
        <div class="spec-row">
          <span class="spec-label"><i class="fa-solid fa-money-bill-wave" style="margin-right:5px;color:var(--teal-deep);"></i> Payment:</span>
          <span class="spec-value">${specs.payment}</span>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-top:14px;">
        <a href="${specs.officialUrl}" target="_blank" rel="noopener" class="btn" style="background:var(--orange-deep);color:#fff;padding:13px 14px;font-size:13.5px;font-weight:700;border-radius:10px;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 14px rgba(240,138,30,0.32);">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Go Directly to this Product on ${brand.name}
        </a>
        <div style="font-size:10.5px;color:var(--muted);text-align:center;margin-top:-2px;word-break:break-all;">
          Direct product link: <a href="${specs.officialUrl}" target="_blank" rel="noopener" style="color:var(--navy);font-weight:600;text-decoration:underline;">${specs.officialUrl}</a>
        </div>

        ${hasOutlets ? `
          <button type="button" class="btn" onclick="closeProductDetailModal(false);openStoreLocationsModal('${brand.id}', 'All Cities')" style="background:var(--navy);color:#fff;padding:11px;font-size:12px;border-radius:10px;display:flex;align-items:center;justify-content:center;gap:6px;">
            <i class="fa-solid fa-store"></i> View Physical ${brand.name} Outlets in Malls
          </button>
        ` : ''}

        ${returnToSaleModal ? `
          <button type="button" class="btn" onclick="closeProductDetailModal(true)" style="background:#EDE8DF;color:var(--navy);padding:10px;font-size:11.5px;border-radius:10px;border:1px solid var(--line);">
            &larr; Return to All ${brand.name} Deals
          </button>
        ` : ''}
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  modal.onclick = (e) => {
    if (e.target === modal) closeProductDetailModal(returnToSaleModal);
  };
}

function closeProductDetailModal(returnToSaleModal) {
  const modal = document.getElementById('productDetailModal');
  if (modal) {
    modal.classList.remove('open');
  }

  const brandModal = document.getElementById('brandSaleModal');
  if (brandModal && returnToSaleModal) {
    brandModal.style.visibility = '';
    brandModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    if (brandModal) {
      brandModal.style.visibility = '';
      brandModal.classList.remove('open');
    }
    document.body.style.overflow = '';
  }
}

function copyProductDetails(brandId, productIndex) {
  const brand = BRANDS.find(b => b.id === brandId);
  if (!brand) return;

  const sale = brand.sale || {};
  const products = Array.isArray(sale.products) ? sale.products : [];
  const product = products[productIndex] || products[0];
  if (!product) return;

  const specs = getProductSpecs(brand, product, productIndex);
  const text = [
    `🛍️ ${brand.name} - ${specs.name}`,
    `💰 Sale Price: ${product.currentPrice || ''} ${product.originalPrice ? `(Regular: ${product.originalPrice} | Save ${specs.savingsFormatted} - ${specs.discountPct})` : ''}`,
    `✨ Collection / Fabric: ${specs.type} - ${specs.fabric}`,
    `🚚 Shipping: ${specs.shipping} (${specs.delivery})`,
    `🏬 Shop on Official Store: ${specs.officialUrl}`,
    `📱 Discovered via BrandGali (https://brandgali.com)`
  ].filter(Boolean).join('\n');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`<i class="fa-solid fa-circle-check"></i> "${specs.name}" details and link copied to clipboard!`);
    }).catch(() => {
      showToast(`Copied details for <strong>${specs.name}</strong>`);
    });
  } else {
    showToast(`Copied details for <strong>${specs.name}</strong>`);
  }
}

// -------------------------------------------------------------
// Deal Timeliness & Urgency Badges
// -------------------------------------------------------------
function renderDealTimelinessBadge(b) {
  if (!b) return '';
  const isSale = b.status === 'sale' || Boolean(b.live);
  if (!isSale) return '';
  return `
    <div class="deal-timeliness-row">
      <span class="deal-verified-pill" title="Verified active on official store catalog today">
        <i class="fa-solid fa-circle-check"></i> Verified Today
      </span>
      <span class="deal-expiry-pill" title="Active promotional window">
        <i class="fa-regular fa-clock"></i> Limited Time
      </span>
    </div>
  `;
}
window.renderDealTimelinessBadge = renderDealTimelinessBadge;

// -------------------------------------------------------------
// Skeleton Loading Shimmer Placeholders
// -------------------------------------------------------------
function renderSkeletonCardsHTML(count = 6) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="skeleton-box" style="width:44px;height:44px;border-radius:50%;flex-shrink:0;"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <div class="skeleton-box" style="height:14px;width:55%;"></div>
            <div class="skeleton-box" style="height:10px;width:35%;"></div>
          </div>
        </div>
        <div class="skeleton-box" style="height:18px;width:80%;margin-top:2px;"></div>
        <div class="skeleton-product-grid">
          <div class="skeleton-box skeleton-thumb"></div>
          <div class="skeleton-box skeleton-thumb"></div>
        </div>
      </div>
    `;
  }
  return html;
}
window.renderSkeletonCardsHTML = renderSkeletonCardsHTML;

// -------------------------------------------------------------
// Web Browser Alerts System (Push / Notifications)
// -------------------------------------------------------------
window.BrandGaliAlerts = {
  isSupported() {
    return 'Notification' in window;
  },
  getPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  },
  init() {
    this.updateButtonsUI();
  },
  async requestPermission() {
    if (!('Notification' in window)) {
      showToast('Browser notifications are not supported by this browser.');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem('brandgali_web_alerts_enabled', 'true');
        showToast('🔔 Web Alerts enabled! You will receive instant sale notifications.');
        try {
          new Notification('BrandGali Sale Alerts Active 🔔', {
            body: "You're all set! You'll receive instant alerts when your followed Pakistani brands launch new sales."
          });
        } catch(e) {}
        this.updateButtonsUI();
        return true;
      } else {
        localStorage.setItem('brandgali_web_alerts_enabled', 'false');
        showToast('Notification permission was denied or dismissed.');
        this.updateButtonsUI();
        return false;
      }
    } catch(err) {
      console.warn('Notification permission error:', err);
      return false;
    }
  },
  updateButtonsUI() {
    const isGranted = ('Notification' in window) && Notification.permission === 'granted';
    document.querySelectorAll('.web-alert-toggle-btn').forEach(btn => {
      if (isGranted) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-bell-slash"></i> <span>Web Alerts: Active</span>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-solid fa-bell"></i> <span>Turn On Web Alerts</span>';
      }
    });

    const pushBannerBtn = document.getElementById('webPushBannerBtn');
    if (pushBannerBtn) {
      if (isGranted) {
        pushBannerBtn.innerHTML = '<i class="fa-solid fa-check"></i> Alerts Active';
        pushBannerBtn.style.background = '#0B7D68';
      } else {
        pushBannerBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Turn On Alerts';
        pushBannerBtn.style.background = '';
      }
    }
  }
};

// -------------------------------------------------------------
// Brand Sales Modal trigger (clicking brand shows sales happening)
// -------------------------------------------------------------
function openBrandDetailDrawer(brandId) {
  // Delegate directly to openBrandSaleModal so clicking brand shows live sales
  openBrandSaleModal(brandId);
}

function closeBrandDetailDrawer() {
  closeBrandSaleModal();
}
window.openBrandDetailDrawer = openBrandDetailDrawer;
window.closeBrandDetailDrawer = closeBrandDetailDrawer;

// -------------------------------------------------------------
// Reactive Search Engine & Keyword Suggestion System
// -------------------------------------------------------------
const TRENDING_SEARCH_KEYWORDS = [
  { query: 'unstitched lawn', label: 'Unstitched Lawn', icon: 'fa-sun', badge: 'Lawn' },
  { query: 'khussa', label: 'Khussa & Chappal', icon: 'fa-shoe-prints', badge: 'Footwear' },
  { query: 'kurti', label: 'Stitched Kurti', icon: 'fa-shirt', badge: 'Pret' },
  { query: 'perfume', label: 'Perfumes & Attar', icon: 'fa-spray-can', badge: 'Fragrance' },
  { query: 'bedsheet', label: 'Bedsheets & Home', icon: 'fa-bed', badge: 'Home' },
  { query: 'under 3000', label: 'Under PKR 3,000', icon: 'fa-wallet', badge: 'Budget' },
  { query: 'flat 50% off', label: 'Flat 50% Off', icon: 'fa-fire', badge: 'Mega Deals' },
  { query: 'polo shirts', label: 'Polo Shirts', icon: 'fa-shirt', badge: 'Trending' },
  { query: '30 percent off', label: '30% Off', icon: 'fa-percent', badge: 'Popular' },
  { query: 'flat 40% off', label: 'Flat 40% Off', icon: 'fa-bolt', badge: 'Hot' },
  { query: 'sneakers', label: 'Sneakers & Shoes', icon: 'fa-shoe-prints', badge: 'Footwear' },
  { query: 'free shipping', label: 'Free Shipping', icon: 'fa-truck-fast', badge: 'Nationwide' },
  { query: 'jacquard', label: 'Jacquard 2-Piece', icon: 'fa-layer-group', badge: 'Festive' },
  { query: '3-piece', label: 'Stitched 3-Piece', icon: 'fa-tags', badge: 'Suits' },
  { query: 'alkaram studio', label: 'Alkaram Studio', icon: 'fa-bag-shopping', badge: 'Brand' },
  { query: 'outfitters', label: 'Outfitters Sale', icon: 'fa-fire-flame-curved', badge: 'Brand' },
  { query: 'charcoal', label: 'Charcoal Deals', icon: 'fa-briefcase', badge: 'Brand' }
];

let currentSearchActiveTab = 'all';

function searchBrandGali(rawQuery) {
  const cleanQ = (rawQuery || '').trim().toLowerCase();
  if (!cleanQ) {
    return { query: '', products: [], brands: [], relatedKeywords: [] };
  }

  // Tokenize words
  const terms = cleanQ.split(/\s+/).filter(Boolean);

  // Special intent detectors
  const isPoloQuery = cleanQ.includes('polo');
  const isLawnQuery = cleanQ.includes('lawn') || cleanQ.includes('unstitched');
  const isKhussaQuery = cleanQ.includes('khussa') || cleanQ.includes('chappal');
  const isKurtiQuery = cleanQ.includes('kurti') || cleanQ.includes('kurta') || cleanQ.includes('kurtas');
  const isPerfumeQuery = cleanQ.includes('perfume') || cleanQ.includes('attar') || cleanQ.includes('fragrance');
  const isBedsheetQuery = cleanQ.includes('bedsheet') || cleanQ.includes('bedding') || cleanQ.includes('cushion');
  const isSneakerQuery = cleanQ.includes('sneaker') || cleanQ.includes('trainer');

  const is30Pct = cleanQ.includes('30%') || cleanQ.includes('30 percent') || cleanQ.includes('30 off') || cleanQ.includes('30');
  const is40Pct = cleanQ.includes('40%') || cleanQ.includes('40 percent') || cleanQ.includes('40 off') || cleanQ.includes('40');
  const is50Pct = cleanQ.includes('50%') || cleanQ.includes('50 percent') || cleanQ.includes('50 off') || cleanQ.includes('50');
  const isFreeShip = cleanQ.includes('free ship') || cleanQ.includes('shipping');

  let priceCap = null;
  const underMatch = cleanQ.match(/(?:under|below|less than)\s*(?:pkr\s*)?(\d+)/i);
  if (underMatch) {
    priceCap = parseInt(underMatch[1], 10);
  } else if (cleanQ.includes('3000') || cleanQ.includes('3,000')) {
    priceCap = 3000;
  } else if (cleanQ.includes('5000') || cleanQ.includes('5,000')) {
    priceCap = 5000;
  } else if (cleanQ.includes('2000') || cleanQ.includes('2,000')) {
    priceCap = 2000;
  }

  // Search products across brands
  const matchedProducts = [];
  BRANDS.forEach(brand => {
    const sale = brand.sale;
    if (!sale || !Array.isArray(sale.products)) return;

    sale.products.forEach((product, pIdx) => {
      const specs = getProductSpecs(brand, product, pIdx);
      const searchBlob = [
        product.name,
        specs.name,
        specs.type,
        specs.fabric,
        specs.description,
        product.discount || '',
        specs.discountPct,
        brand.name,
        brand.category,
        sale.headline || ''
      ].join(' ').toLowerCase();

      let isMatch = false;

      // Intent based matching
      if (isPoloQuery && searchBlob.includes('polo')) {
        isMatch = true;
      } else if (isLawnQuery && (searchBlob.includes('lawn') || searchBlob.includes('unstitched') || searchBlob.includes('suit') || searchBlob.includes('printed') || brand.category === 'Clothing')) {
        isMatch = true;
      } else if (isKhussaQuery && (searchBlob.includes('khussa') || searchBlob.includes('shoe') || searchBlob.includes('chappal') || brand.category === 'Footwear')) {
        isMatch = true;
      } else if (isKurtiQuery && (searchBlob.includes('kurti') || searchBlob.includes('kurta') || searchBlob.includes('pret') || searchBlob.includes('shirt'))) {
        isMatch = true;
      } else if (isPerfumeQuery && (searchBlob.includes('perfume') || searchBlob.includes('attar') || searchBlob.includes('fragrance') || brand.category === 'Lifestyle')) {
        isMatch = true;
      } else if (isBedsheetQuery && (searchBlob.includes('bed') || searchBlob.includes('sheet') || searchBlob.includes('cushion') || brand.category === 'Home Décor')) {
        isMatch = true;
      } else if (isSneakerQuery && (searchBlob.includes('sneaker') || searchBlob.includes('shoe') || brand.category === 'Footwear')) {
        isMatch = true;
      } else if (is30Pct && (specs.discountPct.includes('30%') || searchBlob.includes('30%') || searchBlob.includes('30 percent'))) {
        isMatch = true;
      } else if (is40Pct && (specs.discountPct.includes('40%') || searchBlob.includes('40%') || searchBlob.includes('40 percent'))) {
        isMatch = true;
      } else if (is50Pct && (specs.discountPct.includes('50%') || searchBlob.includes('50%') || searchBlob.includes('50 percent'))) {
        isMatch = true;
      } else if (priceCap && specs.currentPriceNum && specs.currentPriceNum <= priceCap) {
        isMatch = true;
      } else if (isFreeShip && specs.shipping.toLowerCase().includes('free')) {
        isMatch = true;
      } else {
        // Multi-term matching
        isMatch = terms.every(term => searchBlob.includes(term));
      }

      if (isMatch) {
        matchedProducts.push({
          brand,
          product,
          productIndex: pIdx,
          specs
        });
      }
    });
  });

  // Search brands
  const matchedBrands = BRANDS.filter(brand => {
    const brandBlob = [
      brand.name,
      brand.category,
      brand.status || '',
      brand.live ? brand.live.off : '',
      brand.sale ? brand.sale.headline : '',
      brand.sale ? brand.sale.urgency : '',
      brand.color
    ].filter(Boolean).join(' ').toLowerCase();

    if (isPoloQuery) {
      const hasPolo = brand.sale && Array.isArray(brand.sale.products) && brand.sale.products.some(p => (p.name + ' ' + (p.type || '')).toLowerCase().includes('polo'));
      if (hasPolo || brand.category === 'Clothing') return true;
    }

    if (isLawnQuery) {
      if (brand.category === 'Clothing') return true;
    }

    if (isKhussaQuery) {
      if (brand.category === 'Footwear') return true;
    }

    if (isKurtiQuery) {
      if (brand.category === 'Clothing') return true;
    }

    if (isPerfumeQuery) {
      if (brand.category === 'Lifestyle' || brand.name === 'J.' || brandBlob.includes('perfume') || brandBlob.includes('attar')) return true;
    }

    if (isBedsheetQuery) {
      if (brand.category === 'Home Décor' || brandBlob.includes('bedsheet') || brandBlob.includes('home')) return true;
    }

    if (isSneakerQuery) {
      if (brand.category === 'Footwear') return true;
    }

    if (is30Pct && ((brand.live && brand.live.off && brand.live.off.includes('30')) || (brand.sale && brand.sale.headline && brand.sale.headline.includes('30')))) {
      return true;
    }

    if (is40Pct && ((brand.live && brand.live.off && brand.live.off.includes('40')) || (brand.sale && brand.sale.headline && brand.sale.headline.includes('40')))) {
      return true;
    }

    if (is50Pct && ((brand.live && brand.live.off && brand.live.off.includes('50')) || (brand.sale && brand.sale.headline && brand.sale.headline.includes('50')))) {
      return true;
    }

    if (cleanQ === 'sale' || cleanQ === 'sales' || cleanQ === 'discount' || cleanQ === 'discounts') {
      return brand.status === 'sale' || Boolean(brand.live);
    }

    return terms.every(t => brandBlob.includes(t));
  });

  // Related keywords suggestions
  const relatedKeywords = TRENDING_SEARCH_KEYWORDS.filter(kw => {
    return kw.query.toLowerCase().includes(cleanQ) || cleanQ.split(' ').some(t => t.length > 2 && kw.query.toLowerCase().includes(t));
  });

  return {
    query: cleanQ,
    products: matchedProducts,
    brands: matchedBrands,
    relatedKeywords: relatedKeywords.length ? relatedKeywords : TRENDING_SEARCH_KEYWORDS.slice(0, 5)
  };
}

function renderSearchOverlayContent(rawQuery = '', activeTab = 'all') {
  const container = document.getElementById('searchResults');
  if (!container) return;

  currentSearchActiveTab = activeTab;
  const cleanQ = (rawQuery || '').trim();

  // 1. If Empty query: Render Trending Keywords & Quick Discovery
  if (!cleanQ) {
    const liveBrands = BRANDS.filter(b => b.live || b.status === 'sale').slice(0, 6);
    container.innerHTML = `
      <div style="margin-top:4px;">
        <div class="search-section-label">
          <i class="fa-solid fa-arrow-trend-up" style="color:var(--orange-deep);"></i> Popular Searches
        </div>
        <div class="search-chips-wrap">
          ${TRENDING_SEARCH_KEYWORDS.map(kw => `
            <button type="button" class="search-keyword-chip" onclick="window.triggerBrandGaliSearch('${kw.query}')">
              <i class="fa-solid ${kw.icon}"></i>
              <span>${kw.label}</span>
              ${kw.badge ? `<span class="chip-tag">${kw.badge}</span>` : ''}
            </button>
          `).join('')}
        </div>

        <div class="search-section-label">
          <i class="fa-solid fa-bolt" style="color:var(--orange-deep);"></i> Quick Deal Shortcuts
        </div>
        <div class="search-chips-wrap">
          <button type="button" class="search-keyword-chip" onclick="window.triggerBrandGaliSearch('30 percent off')">
            <i class="fa-solid fa-tag"></i> 30% Off Deals
          </button>
          <button type="button" class="search-keyword-chip" onclick="window.triggerBrandGaliSearch('flat 50% off')">
            <i class="fa-solid fa-fire"></i> Flat 50% Off
          </button>
          <button type="button" class="search-keyword-chip" onclick="window.triggerBrandGaliSearch('under 3000')">
            <i class="fa-solid fa-wallet"></i> Under PKR 3,000
          </button>
          <button type="button" class="search-keyword-chip" onclick="window.triggerBrandGaliSearch('free shipping')">
            <i class="fa-solid fa-truck-fast"></i> Free Nationwide Shipping
          </button>
        </div>

        <div class="search-section-label">
          <i class="fa-solid fa-fire" style="color:var(--orange-deep);"></i> Live Brand Sales Right Now
        </div>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none;">
          ${liveBrands.map(b => `
            <button type="button" onclick="closeSearchOverlay();openBrandSaleModal('${b.id}')" style="flex-shrink:0;background:#fff;border:1px solid var(--line);border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:8px;cursor:pointer;text-align:left;">
              ${brandBadgeHTML(b, 30)}
              <div>
                <div style="font-size:12px;font-weight:700;color:var(--navy);line-height:1.2;">${b.name}</div>
                <div style="font-size:10.5px;color:var(--orange-deep);font-weight:700;">${(b.live && b.live.off) || 'Sale Live'}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }

  // 2. Query entered: Run search
  const result = searchBrandGali(cleanQ);
  const totalCount = result.products.length + result.brands.length;

  // Zero results state
  if (totalCount === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:28px 12px;">
        <div style="width:52px;height:52px;background:#EDE8DF;border-radius:50%;display:grid;place-items:center;margin:0 auto 12px;color:var(--navy);font-size:22px;">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <h4 style="font-family:'Poppins';font-size:16px;font-weight:700;color:var(--navy);margin:0 0 4px;">
          No exact matches for "${cleanQ}"
        </h4>
        <p style="font-size:12.5px;color:var(--muted);margin:0 0 16px;">
          Try searching for popular terms like polo shirts, 30% off, lawn, or sneakers:
        </p>
        <div class="search-chips-wrap" style="justify-content:center;">
          ${TRENDING_SEARCH_KEYWORDS.slice(0, 6).map(kw => `
            <button type="button" class="search-keyword-chip" onclick="window.triggerBrandGaliSearch('${kw.query}')">
              <i class="fa-solid ${kw.icon}"></i> ${kw.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }

  // Related suggestion chips
  const suggestionsHTML = result.relatedKeywords.length ? `
    <div style="margin-bottom:10px;">
      <div style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--muted);margin-bottom:6px;">
        Related searches:
      </div>
      <div class="search-chips-wrap" style="margin-bottom:8px;">
        ${result.relatedKeywords.slice(0, 5).map(kw => `
          <button type="button" class="search-keyword-chip" onclick="window.triggerBrandGaliSearch('${kw.query}')">
            <i class="fa-solid ${kw.icon}"></i> ${kw.label}
          </button>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Tabs
  const tabsHTML = `
    <div class="search-tabs-row">
      <button type="button" class="search-tab-btn ${currentSearchActiveTab === 'all' ? 'active' : ''}" onclick="renderSearchOverlayContent('${cleanQ.replace(/'/g, "\\'")}', 'all')">
        All <span class="tab-badge">${totalCount}</span>
      </button>
      <button type="button" class="search-tab-btn ${currentSearchActiveTab === 'products' ? 'active' : ''}" onclick="renderSearchOverlayContent('${cleanQ.replace(/'/g, "\\'")}', 'products')">
        <i class="fa-solid fa-bag-shopping"></i> Sale Items <span class="tab-badge">${result.products.length}</span>
      </button>
      <button type="button" class="search-tab-btn ${currentSearchActiveTab === 'brands' ? 'active' : ''}" onclick="renderSearchOverlayContent('${cleanQ.replace(/'/g, "\\'")}', 'brands')">
        <i class="fa-solid fa-store"></i> Brands <span class="tab-badge">${result.brands.length}</span>
      </button>
    </div>
  `;

  // Products HTML
  let productsHTML = '';
  if ((currentSearchActiveTab === 'all' || currentSearchActiveTab === 'products') && result.products.length > 0) {
    productsHTML = `
      <div class="search-section-label">
        <i class="fa-solid fa-bag-shopping" style="color:var(--orange-deep);"></i> Sale Items & Deals (${result.products.length})
      </div>
      <div class="search-product-grid">
        ${result.products.map(item => {
          const p = item.product;
          const b = item.brand;
          const s = item.specs;
          return `
            <div class="search-product-card" onclick="closeSearchOverlay();openProductDetailModal('${b.id}', ${item.productIndex}, false)">
              <div class="search-product-thumb">
                ${p.image ? `<img src="${p.image}" alt="${p.name.replace(/"/g,'&quot;')}" loading="lazy">` : `<div style="height:100%;display:grid;place-items:center;color:var(--muted);"><i class="fa-solid fa-bag-shopping" style="font-size:24px;"></i></div>`}
                <div class="search-product-badge">${s.discountPct || 'Sale'}</div>
                <div class="search-product-preview-tag"><i class="fa-regular fa-eye"></i> Details</div>
              </div>
              <div style="padding:10px;display:flex;flex-direction:column;flex:1;">
                <div style="font-size:10.5px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:2px;display:flex;align-items:center;gap:4px;">
                  <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${b.color};"></span>
                  ${b.name}
                </div>
                <div style="font-family:'Poppins';font-weight:700;font-size:12.5px;color:var(--navy);line-height:1.3;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                  ${p.name}
                </div>
                <div style="margin-top:auto;display:flex;align-items:baseline;gap:6px;">
                  <span style="font-size:14px;font-weight:800;color:var(--orange-deep);">${p.currentPrice || 'Sale Price'}</span>
                  ${p.originalPrice ? `<span style="font-size:11px;color:var(--muted);text-decoration:line-through;">${p.originalPrice}</span>` : ''}
                </div>
                <a href="${p.url || s.officialUrl}" target="_blank" rel="noopener" class="direct-product-link" onclick="event.stopPropagation();" title="Direct store link for ${p.name}">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Direct Store Link
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Brands HTML
  let brandsHTML = '';
  if ((currentSearchActiveTab === 'all' || currentSearchActiveTab === 'brands') && result.brands.length > 0) {
    brandsHTML = `
      <div class="search-section-label">
        <i class="fa-solid fa-store" style="color:var(--orange-deep);"></i> Pakistani Brands (${result.brands.length})
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;">
        ${result.brands.map(b => {
          const hasSale = b.status === 'sale' || Boolean(b.live);
          const saleOff = (b.live && b.live.off) || (b.sale && b.sale.headline) || null;
          return `
            <div class="search-result-row">
              <div onclick="closeSearchOverlay();openBrandSaleModal('${b.id}')" style="cursor:pointer;" title="View ${b.name} sale happening">
                ${brandBadgeHTML(b, 40)}
              </div>
              <div style="flex:1;min-width:0;cursor:pointer;" onclick="closeSearchOverlay();openBrandSaleModal('${b.id}')">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span class="n">${b.name}</span>
                  ${hasSale ? `<span style="background:#FDEBD3;color:var(--orange-deep);font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:8px;">${saleOff || 'SALE'}</span>` : ''}
                </div>
                <div class="c">${b.category} &bull; ${b.priceRange || 'Mid Range'}</div>
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0;">
                <button type="button" class="btn" onclick="closeSearchOverlay();openBrandSaleModal('${b.id}')" style="padding:6px 12px;font-size:11px;${hasSale ? 'background:var(--orange);color:#fff;' : 'background:#EDE8DF;color:var(--navy);'}border-radius:8px;font-weight:700;">
                  <i class="fa-solid ${hasSale ? 'fa-fire' : 'fa-tags'}"></i> ${hasSale ? 'View Sale' : 'Check Sales'}
                </button>
                <a href="${b.url}" target="_blank" rel="noopener" class="btn" style="padding:6px 10px;font-size:11px;background:#fff;border:1px solid var(--line);color:var(--navy);border-radius:8px;text-decoration:none;">
                  Visit <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:9px;"></i>
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  container.innerHTML = `
    ${suggestionsHTML}
    ${tabsHTML}
    ${productsHTML}
    ${brandsHTML}
  `;
}

function openSearchOverlay(initialQuery = '') {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (!overlay) return;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (input) {
    input.value = initialQuery;
    if (clearBtn) {
      if (initialQuery) clearBtn.classList.add('visible');
      else clearBtn.classList.remove('visible');
    }
    input.focus();
  }

  renderSearchOverlayContent(initialQuery, 'all');
}

function closeSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
  // Only restore scroll if other modals are not open
  const brandModal = document.getElementById('brandSaleModal');
  const productModal = document.getElementById('productDetailModal');
  if ((!brandModal || !brandModal.classList.contains('open')) &&
      (!productModal || !productModal.classList.contains('open'))) {
    document.body.style.overflow = '';
  }
}

window.openSearchOverlay = openSearchOverlay;
window.closeSearchOverlay = closeSearchOverlay;
window.triggerBrandGaliSearch = function(query) {
  openSearchOverlay(query);
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = query;
    const clearBtn = document.getElementById('searchClearBtn');
    if (clearBtn) clearBtn.classList.add('visible');
    input.focus();
  }
};

function setupBrandGaliReactiveSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const closeBtn = document.getElementById('searchCloseBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearchOverlay);
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSearchOverlay();
      }
    });
  }

  if (clearBtn && input) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('visible');
      input.focus();
      renderSearchOverlayContent('', 'all');
    });
  }

  if (input) {
    input.addEventListener('input', () => {
      const q = input.value;
      if (clearBtn) {
        if (q.trim()) clearBtn.classList.add('visible');
        else clearBtn.classList.remove('visible');
      }
      renderSearchOverlayContent(q, currentSearchActiveTab);
    });
  }

  // Wire search icons and buttons
  document.getElementById('searchBtn')?.addEventListener('click', () => openSearchOverlay(''));
  document.getElementById('heroSearchBtn')?.addEventListener('click', () => openSearchOverlay(''));
  document.getElementById('heroSearchBox')?.addEventListener('click', (e) => {
    // If clicked on a chip inside, don't double open
    if (e.target.closest('.hero-search-chip')) return;
    openSearchOverlay('');
  });

  // Wire hero search popular chips
  document.querySelectorAll('.hero-search-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const q = chip.getAttribute('data-query') || chip.textContent.trim();
      window.triggerBrandGaliSearch(q);
    });
  });
}

// Auto-initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupBrandGaliReactiveSearch);
} else {
  setupBrandGaliReactiveSearch();
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearchOverlay();
    closeProductDetailModal(false);
    closeBrandSaleModal();
    if (typeof closeStoreLocationsModal === 'function') closeStoreLocationsModal();
    if (typeof closeWaitlistModal === 'function') closeWaitlistModal();
  }
});

function loadSalesStatus() {
  return Promise.resolve(BRANDS);
}

// -------------------------------------------------------------
// Brands Near Me - Physical Store Directory & Location Helpers
// -------------------------------------------------------------
const PAK_CITIES = [
  { name: 'Lahore', lat: 31.5204, lon: 74.3587 },
  { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
  { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
  { name: 'Rawalpindi', lat: 33.5651, lon: 73.0169 },
  { name: 'Faisalabad', lat: 31.4504, lon: 73.1350 },
  { name: 'Multan', lat: 30.1575, lon: 71.5249 },
  { name: 'Peshawar', lat: 34.0151, lon: 71.5249 },
  { name: 'Sialkot', lat: 32.4945, lon: 74.5229 },
  { name: 'Gujranwala', lat: 32.1877, lon: 74.1945 },
  { name: 'Hyderabad', lat: 25.3960, lon: 68.3578 }
];

const BRAND_PHYSICAL_STORES = {
  'khaadi': {
    totalOutlets: 68,
    cities: {
      'Lahore': ['Packages Mall (Ground Floor)', 'Emporium Mall', 'MM Alam Road Gulberg', 'DHA Phase 5 Raya Commercial', 'Mall of Lahore Cantt'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road Flagship', 'Ocean Mall Clifton', 'Dolmen Mall Hyderi'],
      'Islamabad': ['Centaurus Mall (1st Floor)', 'F-7 Jinnah Super Markaz', 'Giga Mall DHA-2', 'Beverly Centre F-6'],
      'Rawalpindi': ['Bank Road Saddar', 'Bahria Town Phase 4 Civic Center'],
      'Faisalabad': ['D-Ground Peoples Colony', 'Lyallpur Galleria East Canal Rd'],
      'Multan': ['Mall of Multan (Bosan Rd)', 'Gulgasht Colony Commercial'],
      'Peshawar': ['University Road', 'Deans Trade Center Cantt'],
      'Sialkot': ['V-Mall Paris Road', 'Cantt Shopping Mall'],
      'Gujranwala': ['Kings Mall By-Pass Rd', 'Satellite Town'],
      'Hyderabad': ['Boulevard Mall Auto Bhan', 'Saddar Bazaar']
    }
  },
  'sapphire': {
    totalOutlets: 42,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'Gulberg Galleria Main Blvd', 'DHA Phase 5 Raya', 'Mall of Lahore'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road', 'Dolmen Mall Hyderi'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Saddar Bank Road', 'Bahria Town Phase 4'],
      'Faisalabad': ['Lyallpur Galleria', 'D-Ground Peoples Colony'],
      'Multan': ['Mall of Multan', 'Gulgasht Colony'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall By-Pass'],
      'Hyderabad': ['Boulevard Mall Auto Bhan']
    }
  },
  'gul-ahmed': {
    totalOutlets: 110,
    cities: {
      'Lahore': ['Ideas Packages Mall', 'Ideas Emporium Mall', 'MM Alam Road', 'Mall of Lahore', 'DHA Phase 5 Commercial'],
      'Karachi': ['Ideas Dolmen Clifton', 'Ideas Lucky One', 'Tariq Road Superstore', 'Clifton Ocean Mall', 'Bahadurabad'],
      'Islamabad': ['Centaurus Mall', 'F-7 Jinnah Super', 'Giga Mall', 'Safa Gold Mall F-7'],
      'Rawalpindi': ['Bank Road Saddar', 'Murree Road Commercial'],
      'Faisalabad': ['D-Ground', 'Lyallpur Galleria'],
      'Multan': ['Mall of Multan', 'Abdali Road'],
      'Peshawar': ['University Road', 'Deans Trade Center'],
      'Sialkot': ['Aziz Shaheed Road Cantt'],
      'Gujranwala': ['Kings Mall', 'GT Road'],
      'Hyderabad': ['Auto Bhan Road', 'Saddar']
    }
  },
  'j-junaid-jamshed': {
    totalOutlets: 125,
    cities: {
      'Lahore': ['MM Alam Road Gulberg', 'Packages Mall', 'Emporium Mall', 'DHA Phase 5 Raya', 'Fortress Stadium Cantt', 'Allama Iqbal Town'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road Flagship', 'Bahadurabad', 'Dolmen Mall Hyderi', 'Zamzama DHA'],
      'Islamabad': ['Centaurus Mall', 'F-7 Jinnah Super', 'Giga Mall DHA-2', 'Blue Area Jinnah Ave'],
      'Rawalpindi': ['Saddar Bank Road', 'Commercial Market Satellite Town', 'Bahria Town Phase 4'],
      'Faisalabad': ['D-Ground Peoples Colony', 'Lyallpur Galleria', 'Satyana Road'],
      'Multan': ['Mall of Multan', 'Gulgasht Colony', 'Bosan Road'],
      'Peshawar': ['University Road', 'Saddar Road Cantt'],
      'Sialkot': ['Paris Road', 'V-Mall'],
      'Gujranwala': ['Kings Mall', 'Satellite Town Commercial'],
      'Hyderabad': ['Auto Bhan Road', 'Boulevard Mall']
    }
  },
  'outfitters': {
    totalOutlets: 58,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'MM Alam Road Gulberg', 'Mall of Lahore', 'DHA Phase 5 Commercial'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road', 'Dolmen Mall Hyderi'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Bank Road Saddar', 'Bahria Town Phase 4'],
      'Faisalabad': ['D-Ground', 'Lyallpur Galleria'],
      'Multan': ['Mall of Multan Bosan Rd'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall By-Pass'],
      'Hyderabad': ['Boulevard Mall Auto Bhan']
    }
  },
  'nishat-linen': {
    totalOutlets: 76,
    cities: {
      'Lahore': ['Gulberg Galleria', 'Packages Mall', 'Emporium Mall', 'DHA Phase 5 Raya', 'Fortress Stadium'],
      'Karachi': ['Dolmen Clifton', 'Lucky One Mall', 'Tariq Road', 'Ocean Mall'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Saddar Commercial', 'Bahria Town'],
      'Faisalabad': ['Lyallpur Galleria', 'D-Ground'],
      'Multan': ['Mall of Multan', 'Gulgasht'],
      'Peshawar': ['University Road'],
      'Sialkot': ['V-Mall Paris Road'],
      'Gujranwala': ['Kings Mall'],
      'Hyderabad': ['Boulevard Mall']
    }
  },
  'alkaram-studio': {
    totalOutlets: 52,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'MM Alam Road', 'DHA Phase 5'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road', 'Dolmen Mall Hyderi'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Bank Road Saddar'],
      'Faisalabad': ['D-Ground Peoples Colony'],
      'Multan': ['Mall of Multan'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall'],
      'Hyderabad': ['Boulevard Mall']
    }
  },
  'sana-safinaz': {
    totalOutlets: 38,
    cities: {
      'Lahore': ['MM Alam Road Gulberg', 'Packages Mall', 'Mall of Lahore', 'DHA Phase 5 Raya'],
      'Karachi': ['Dolmen Clifton', 'Lucky One Mall', 'Ocean Mall', 'Zamzama Boulevard'],
      'Islamabad': ['Centaurus Mall', 'F-6 Super Market', 'Giga Mall'],
      'Rawalpindi': ['Bank Road Saddar'],
      'Faisalabad': ['D-Ground Peoples Colony'],
      'Multan': ['Mall of Multan'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall']
    }
  },
  'maria-b': {
    totalOutlets: 34,
    cities: {
      'Lahore': ['MM Alam Road', 'Packages Mall', 'Mall of Lahore', 'DHA Phase 5'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall'],
      'Rawalpindi': ['Saddar Bank Road'],
      'Faisalabad': ['D-Ground Peoples Colony'],
      'Multan': ['Mall of Multan'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road']
    }
  },
  'breakout': {
    totalOutlets: 45,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'MM Alam Road Gulberg', 'Mall of Lahore', 'DHA Phase 5'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road', 'Dolmen Mall Hyderi'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Bank Road Saddar', 'Bahria Town Phase 4'],
      'Faisalabad': ['Lyallpur Galleria', 'D-Ground'],
      'Multan': ['Mall of Multan'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall'],
      'Hyderabad': ['Boulevard Mall']
    }
  },
  'charcoal': {
    totalOutlets: 38,
    cities: {
      'Lahore': ['Packages Mall', 'MM Alam Road', 'Mall of Lahore', 'DHA Phase 5 Raya'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road', 'Ocean Mall'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall'],
      'Rawalpindi': ['Saddar Bank Road'],
      'Faisalabad': ['D-Ground', 'Lyallpur Galleria'],
      'Multan': ['Mall of Multan'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road']
    }
  },
  'bata-pk': {
    totalOutlets: 420,
    cities: {
      'Lahore': ['Mall Road Flagship', 'Packages Mall', 'Emporium Mall', 'MM Alam Road', 'Anarkali', 'DHA Phase 5'],
      'Karachi': ['Dolmen Clifton', 'Lucky One Mall', 'Tariq Road', 'Saddar Preedy St', 'Hyderi', 'Bahadurabad'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Blue Area', 'Giga Mall DHA-2', 'F-10 Markaz'],
      'Rawalpindi': ['Bank Road Saddar', 'Commercial Market Satellite Town', 'Murree Road'],
      'Faisalabad': ['D-Ground', 'Rail Bazar', 'Lyallpur Galleria'],
      'Multan': ['Mall of Multan', 'Bosan Road', 'Hussain Agahi'],
      'Peshawar': ['University Road', 'Deans Trade Center', 'Cantt Saddar'],
      'Sialkot': ['Paris Road', 'Kutchery Road'],
      'Gujranwala': ['Kings Mall', 'GT Road', 'Satellite Town'],
      'Hyderabad': ['Auto Bhan Road', 'Saddar', 'Resham Gali']
    }
  },
  'servis': {
    totalOutlets: 160,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'The Mall', 'DHA Commercial', 'Allama Iqbal Town'],
      'Karachi': ['Lucky One Mall', 'Tariq Road', 'Atrium Mall Saddar', 'Hyderi'],
      'Islamabad': ['Centaurus Mall', 'Giga Mall', 'F-7 Markaz'],
      'Rawalpindi': ['Bank Road Saddar', 'Murree Road'],
      'Faisalabad': ['D-Ground', 'Lyallpur Galleria'],
      'Multan': ['Mall of Multan', 'Gulgasht'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Satellite Town'],
      'Hyderabad': ['Boulevard Mall']
    }
  },
  'borjan': {
    totalOutlets: 130,
    cities: {
      'Lahore': ['MM Alam Road', 'Packages Mall', 'Emporium Mall', 'Mall of Lahore', 'DHA Phase 5'],
      'Karachi': ['Dolmen Clifton', 'Lucky One Mall', 'Tariq Road'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall'],
      'Rawalpindi': ['Saddar Bank Road', 'Commercial Market'],
      'Faisalabad': ['D-Ground', 'Lyallpur Galleria'],
      'Multan': ['Mall of Multan', 'Gulgasht'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall'],
      'Hyderabad': ['Auto Bhan Road']
    }
  },
  'ndure': {
    totalOutlets: 95,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'MM Alam Road', 'Y-Block DHA Phase 3'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road'],
      'Islamabad': ['Centaurus Mall', 'Giga Mall', 'F-7 Markaz'],
      'Rawalpindi': ['Bank Road Saddar'],
      'Faisalabad': ['Lyallpur Galleria', 'D-Ground'],
      'Multan': ['Mall of Multan'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall'],
      'Hyderabad': ['Boulevard Mall']
    }
  },
  'stylo': {
    totalOutlets: 140,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'MM Alam Road', 'Fortress Stadium', 'DHA Phase 5'],
      'Karachi': ['Dolmen Clifton', 'Lucky One Mall', 'Tariq Road', 'Dolmen Mall Hyderi'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Bank Road Saddar', 'Commercial Market'],
      'Faisalabad': ['D-Ground', 'Lyallpur Galleria'],
      'Multan': ['Mall of Multan', 'Gulgasht'],
      'Peshawar': ['University Road', 'Deans Trade Center'],
      'Sialkot': ['V-Mall Paris Road'],
      'Gujranwala': ['Kings Mall'],
      'Hyderabad': ['Boulevard Mall']
    }
  },
  'habitt': {
    totalOutlets: 14,
    cities: {
      'Karachi': ['Dolmen Mall Clifton Flagship', 'Tipu Sultan Road', 'Lucky One Mall'],
      'Lahore': ['Packages Mall (1st Floor)', 'Gulberg Main Boulevard'],
      'Islamabad': ['Giga Mall DHA-2', 'F-7 Markaz']
    }
  },
  'ideas-home': {
    totalOutlets: 95,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'MM Alam Road', 'DHA Phase 5'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Tariq Road'],
      'Islamabad': ['Centaurus Mall', 'F-7 Markaz', 'Giga Mall'],
      'Rawalpindi': ['Bank Road Saddar'],
      'Faisalabad': ['D-Ground Peoples Colony'],
      'Multan': ['Mall of Multan'],
      'Peshawar': ['University Road'],
      'Sialkot': ['Paris Road'],
      'Gujranwala': ['Kings Mall'],
      'Hyderabad': ['Auto Bhan Road']
    }
  },
  'chenone': {
    totalOutlets: 38,
    cities: {
      'Lahore': ['Gulberg Main Boulevard', 'DHA Phase 3', 'Packages Mall'],
      'Karachi': ['Park Towers Clifton', 'Tariq Road'],
      'Islamabad': ['Beverly Centre F-6', 'Giga Mall'],
      'Rawalpindi': ['Peshawar Road', 'Saddar'],
      'Faisalabad': ['ChenOne Tower Peoples Colony'],
      'Multan': ['Abdali Road'],
      'Peshawar': ['University Road']
    }
  },
  'miniso-pk': {
    totalOutlets: 35,
    cities: {
      'Lahore': ['Packages Mall', 'Emporium Mall', 'Gulberg MM Alam Rd', 'Mall of Lahore'],
      'Karachi': ['Dolmen Mall Clifton', 'Lucky One Mall', 'Ocean Mall'],
      'Islamabad': ['Centaurus Mall', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Bahria Town Phase 4'],
      'Faisalabad': ['Lyallpur Galleria']
    }
  },
  'saeed-ghani': {
    totalOutlets: 65,
    cities: {
      'Karachi': ['Tariq Road Flagship', 'Dolmen Mall Clifton', 'Lucky One Mall', 'Dolmen Hyderi'],
      'Lahore': ['Packages Mall', 'Emporium Mall', 'Liberty Market Gulberg', 'DHA Phase 5'],
      'Islamabad': ['Centaurus Mall', 'Giga Mall DHA-2'],
      'Rawalpindi': ['Commercial Market Satellite Town'],
      'Faisalabad': ['D-Ground Peoples Colony'],
      'Multan': ['Mall of Multan']
    }
  },
  'hub-leather': {
    totalOutlets: 18,
    cities: {
      'Karachi': ['Dolmen Mall Clifton', 'Ocean Mall Clifton'],
      'Lahore': ['Packages Mall', 'Mall of Lahore Cantt', 'Emporium Mall'],
      'Islamabad': ['Centaurus Mall', 'Beverly Centre F-6']
    }
  },
  'jafferjees': {
    totalOutlets: 14,
    cities: {
      'Karachi': ['Dolmen Mall Clifton', 'Park Towers Clifton', 'Saddar Victoria Road'],
      'Lahore': ['Mall of Lahore Cantt', 'MM Alam Road Gulberg'],
      'Islamabad': ['Centaurus Mall', 'Beverly Centre F-6']
    }
  }
};

// Calculate Haversine distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getClosestCity(lat, lon) {
  let closest = PAK_CITIES[0];
  let minDistance = Infinity;
  for (const city of PAK_CITIES) {
    const dist = calculateDistanceKm(lat, lon, city.lat, city.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }
  return { ...closest, distance: minDistance };
}

function detectUserLocationAndStores() {
  const btn = document.getElementById('useMyLocationBtn');
  if (!navigator.geolocation) {
    showToast('<i class="fa-solid fa-triangle-exclamation"></i> Geolocation is not supported by your browser.');
    return;
  }
  
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Detecting City...';
    btn.disabled = true;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const closest = getClosestCity(lat, lon);
      
      const citySelect = document.getElementById('citySelect');
      if (citySelect) {
        citySelect.value = closest.name;
      }

      renderBrandsNearMe(closest.name, closest.distance);

      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> ${closest.name} (~${Math.round(closest.distance)} km away)`;
        btn.disabled = false;
      }
      showToast(`<i class="fa-solid fa-location-dot"></i> Located nearest city: ${closest.name}! Showing local stores.`);
    },
    (err) => {
      console.warn('Geolocation error:', err);
      if (btn) {
        btn.innerHTML = '<i class="fa-regular fa-compass"></i> Use My Location';
        btn.disabled = false;
      }
      const citySelect = document.getElementById('citySelect');
      if (citySelect) {
        citySelect.value = 'Lahore';
      }
      renderBrandsNearMe('Lahore');
      showToast('<i class="fa-solid fa-info-circle"></i> Location access not granted - showing Lahore retail stores.');
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

function onCitySelected(cityName) {
  if (!cityName) {
    const resultsEl = document.getElementById('nearMeResults');
    if (resultsEl) resultsEl.innerHTML = '';
    return;
  }
  renderBrandsNearMe(cityName);
}

function renderBrandsNearMe(cityName, distanceKm) {
  const container = document.getElementById('nearMeResults');
  if (!container) return;

  const brandsWithStoresInCity = BRANDS.map(brand => {
    const storeInfo = BRAND_PHYSICAL_STORES[brand.id];
    if (!storeInfo || !storeInfo.cities[cityName]) return null;
    return {
      brand,
      locations: storeInfo.cities[cityName],
      totalOutlets: storeInfo.totalOutlets
    };
  }).filter(Boolean);

  if (brandsWithStoresInCity.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:16px;background:#fff;border-radius:12px;border:1px solid var(--line);font-size:12.5px;color:var(--muted);margin-top:12px;">
        <i class="fa-solid fa-store-slash" style="font-size:24px;color:var(--orange);margin-bottom:8px;display:block;"></i>
        No physical stores found in ${cityName} yet. Try selecting Lahore, Karachi, or Islamabad!
      </div>
    `;
    return;
  }

  const distBadge = distanceKm !== undefined ? `<span style="font-size:10.5px;background:#E2E8F0;color:var(--navy);padding:2px 7px;border-radius:6px;font-weight:600;">~${Math.round(distanceKm)} km away</span>` : '';

  const cardsHTML = brandsWithStoresInCity.map(({ brand, locations, totalOutlets }) => {
    const isSale = brand.status === 'sale';
    const saleTag = isSale ? `
      <button type="button" onclick="openBrandSaleModal('${brand.id}')" style="background:#FEF3D6;color:#B45309;border:1px solid #FDE68A;border-radius:6px;padding:3px 8px;font-size:10.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
        <i class="fa-solid fa-fire" style="color:#D5473F;"></i> ${brand.live ? brand.live.off : 'Sale Live'} &bull; View Deals
      </button>
    ` : '';

    const locationsSummary = locations.slice(0, 3).join(', ') + (locations.length > 3 ? ` +${locations.length - 3} more` : '');

    return `
      <div class="store-brand-card">
        <div class="store-brand-head">
          ${brandBadgeHTML(brand, 38)}
          <div style="flex:1;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <span class="store-brand-name">${brand.name}</span>
              <span style="font-size:10.5px;font-weight:700;color:var(--teal-deep);background:#E6F6F2;padding:2px 7px;border-radius:5px;">${locations.length} Outlet${locations.length > 1 ? 's' : ''}</span>
            </div>
            <div class="store-brand-meta">${brand.category} &bull; ${totalOutlets} stores nationwide</div>
          </div>
        </div>

        <div class="store-locations-tag">
          <i class="fa-solid fa-location-dot"></i>
          <span><b>${cityName}:</b> ${locationsSummary}</span>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;">
          <div>
            ${saleTag}
          </div>
          <button type="button" class="btn" onclick="openStoreLocationsModal('${brand.id}', '${cityName}')" style="padding:6px 12px;font-size:11.5px;border-radius:8px;background:var(--navy);display:inline-flex;align-items:center;gap:4px;">
            <i class="fa-solid fa-map-location-dot"></i> View Outlets
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="near-me-status-bar">
      <span><i class="fa-solid fa-location-dot" style="color:var(--orange-deep);margin-right:6px;"></i> ${brandsWithStoresInCity.length} Brands in ${cityName}</span>
      ${distBadge}
    </div>
    <div class="near-me-store-list">
      ${cardsHTML}
    </div>
  `;

  const badgeEl = document.getElementById('nearMeCountBadge');
  if (badgeEl) {
    badgeEl.textContent = `${brandsWithStoresInCity.length} Brands in ${cityName}`;
  }
}

function browseAllPhysicalStores() {
  const container = document.getElementById('nearMeResults');
  if (!container) return;

  const brandsWithStores = BRANDS.map(brand => {
    const storeInfo = BRAND_PHYSICAL_STORES[brand.id];
    if (!storeInfo) return null;
    const citiesCount = Object.keys(storeInfo.cities).length;
    return { brand, storeInfo, citiesCount };
  }).filter(Boolean).sort((a, b) => b.storeInfo.totalOutlets - a.storeInfo.totalOutlets);

  const cardsHTML = brandsWithStores.map(({ brand, storeInfo, citiesCount }) => {
    const topCities = Object.keys(storeInfo.cities).slice(0, 4).join(', ');
    const isSale = brand.status === 'sale';

    return `
      <div class="store-brand-card">
        <div class="store-brand-head">
          ${brandBadgeHTML(brand, 38)}
          <div style="flex:1;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <span class="store-brand-name">${brand.name}</span>
              <span style="font-size:11px;font-weight:800;color:var(--orange-deep);background:#FEF3D6;padding:2px 8px;border-radius:5px;">${storeInfo.totalOutlets}+ Outlets</span>
            </div>
            <div class="store-brand-meta">${brand.category} &bull; Present in ${citiesCount}+ cities across Pakistan</div>
          </div>
        </div>

        <div class="store-locations-tag">
          <i class="fa-solid fa-city"></i>
          <span><b>Key Cities:</b> ${topCities}${citiesCount > 4 ? ` +${citiesCount - 4} more` : ''}</span>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;">
          ${isSale ? `
            <button type="button" onclick="openBrandSaleModal('${brand.id}')" style="background:#FEE2E2;color:#991B1B;border:0;border-radius:6px;padding:4px 8px;font-size:10.5px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">
              <i class="fa-solid fa-fire"></i> ${brand.live ? brand.live.off : 'Sale Live'}
            </button>
          ` : '<span></span>'}
          <button type="button" class="btn" onclick="openStoreLocationsModal('${brand.id}', 'All Cities')" style="padding:6px 12px;font-size:11.5px;border-radius:8px;background:var(--navy);display:inline-flex;align-items:center;gap:4px;">
            <i class="fa-solid fa-map-location-dot"></i> Outlets List
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="near-me-status-bar">
      <span><i class="fa-solid fa-store" style="color:var(--teal-deep);margin-right:6px;"></i> ${brandsWithStores.length} Brands with Physical Stores</span>
      <span style="font-weight:500;color:var(--muted);">Nationwide Presence</span>
    </div>
    <div class="near-me-store-list">
      ${cardsHTML}
    </div>
  `;

  const badgeEl = document.getElementById('nearMeCountBadge');
  if (badgeEl) {
    badgeEl.textContent = `${brandsWithStores.length} Retail Brands`;
  }
  showToast('<i class="fa-solid fa-store"></i> Showing all brands with physical retail stores across Pakistan.');
}

// Store locations modal (outlets in a city or all cities)
function openStoreLocationsModal(brandId, cityName) {
  const brand = BRANDS.find(b => b.id === brandId);
  if (!brand) return;
  const storeInfo = BRAND_PHYSICAL_STORES[brandId];
  if (!storeInfo) return;

  let modal = document.getElementById('storeLocationsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'storeLocationsModal';
    modal.className = 'brand-sale-modal';
    document.body.appendChild(modal);
  }

  const citiesToRender = (cityName && cityName !== 'All Cities' && storeInfo.cities[cityName])
    ? { [cityName]: storeInfo.cities[cityName] }
    : storeInfo.cities;

  const cityBlocksHTML = Object.entries(citiesToRender).map(([city, outlets]) => {
    return `
      <div style="margin-bottom:14px;background:#F9F7F3;border:1px solid var(--line);border-radius:12px;padding:12px;">
        <div style="font-family:'Poppins';font-weight:700;font-size:13.5px;color:var(--navy);margin-bottom:8px;display:flex;align-items:center;gap:6px;">
          <i class="fa-solid fa-location-dot" style="color:var(--orange-deep);"></i> ${city}
          <span style="font-size:10.5px;font-weight:600;color:var(--muted);margin-left:auto;">${outlets.length} location${outlets.length > 1 ? 's' : ''}</span>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;">
          ${outlets.map(loc => `
            <li style="font-size:12px;color:#374151;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px dashed #E5E7EB;">
              <span><i class="fa-regular fa-building" style="color:var(--teal-deep);margin-right:6px;"></i> ${loc}</span>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.name + ' ' + loc + ' ' + city)}" target="_blank" rel="noopener" style="color:var(--navy);font-size:11px;font-weight:700;text-decoration:none;white-space:nowrap;">
                Map &rarr;
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="brand-sale-dialog">
      <div class="modal-drag-handle"></div>
      <div class="sale-modal-head">
        ${brandBadgeHTML(brand, 44)}
        <div style="flex:1;">
          <div style="font-family:'Poppins';font-weight:800;font-size:16px;color:var(--navy);">${brand.name} Stores</div>
          <div style="font-size:11.5px;color:var(--muted);">${brand.category} &bull; ${storeInfo.totalOutlets}+ Outlets Nationwide</div>
        </div>
        <button class="sale-modal-close" onclick="closeStoreLocationsModal()" aria-label="Close">&times;</button>
      </div>

      <div style="margin:12px 0 6px;font-size:12.5px;color:var(--muted);display:flex;align-items:center;gap:6px;">
        <i class="fa-solid fa-shop" style="color:var(--orange-deep);"></i>
        <span>Find official ${brand.name} outlets in malls and shopping high streets:</span>
      </div>

      <div style="max-height:55vh;overflow-y:auto;padding-right:2px;margin:8px 0 14px;">
        ${cityBlocksHTML}
      </div>

      <div style="display:flex;gap:8px;">
        ${brand.status === 'sale' ? `
          <button type="button" class="btn" onclick="closeStoreLocationsModal();openBrandSaleModal('${brand.id}')" style="flex:1;background:var(--orange-deep);padding:10px 12px;font-size:12px;border-radius:10px;">
            <i class="fa-solid fa-fire"></i> View Active Sale Deals
          </button>
        ` : ''}
        <button type="button" class="btn" onclick="closeStoreLocationsModal()" style="flex:1;background:var(--navy);padding:10px 12px;font-size:12px;border-radius:10px;">
          Done
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  modal.onclick = (e) => {
    if (e.target === modal) closeStoreLocationsModal();
  };
}

function closeStoreLocationsModal() {
  const modal = document.getElementById('storeLocationsModal');
  if (modal) {
    modal.classList.remove('open');
  }
  document.body.style.overflow = '';
}

// -------------------------------------------------------------
// VIP Waitlist & Account Modal
// -------------------------------------------------------------
function openWaitlistModal() {
  let modal = document.getElementById('waitlistModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'waitlistModal';
    modal.className = 'brand-sale-modal';
    document.body.appendChild(modal);
  }

  const savedList = getFollowedBrands();
  const alreadyJoined = localStorage.getItem('brandgali_waitlist_email');

  modal.innerHTML = `
    <div class="brand-sale-dialog">
      <div class="modal-drag-handle"></div>
      <div class="sale-modal-head">
        <div style="width:44px;height:44px;border-radius:12px;background:var(--navy);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;box-shadow:0 4px 10px rgba(11,37,69,0.15);">
          <i class="fa-solid fa-mobile-screen"></i>
        </div>
        <div style="flex:1;">
          <div style="font-family:'Poppins';font-weight:800;font-size:16px;color:var(--navy);">BrandGali Account & VIP Access</div>
          <div style="font-size:11.5px;color:var(--muted);">For iOS & Android Apps & Sale Alerts</div>
        </div>
        <button class="sale-modal-close" onclick="closeWaitlistModal()" aria-label="Close">&times;</button>
      </div>

      <div style="background:#F0FAF7;border:1px solid #A7F3D0;border-radius:12px;padding:12px;margin:14px 0 12px;display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;border-radius:50%;background:#0B7D68;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">
          <i class="fa-solid fa-bell"></i>
        </div>
        <div style="font-size:12px;color:var(--teal-deep);line-height:1.4;">
          <b>${savedList.length} Brand${savedList.length === 1 ? '' : 's'} Alerted:</b> You will receive instant notifications whenever your followed brands launch sales.
        </div>
      </div>

      <div style="font-size:12.5px;color:#374151;margin-bottom:12px;line-height:1.5;">
        ${alreadyJoined
          ? `<div style="background:#FEF3D6;border:1px solid #FDE68A;border-radius:10px;padding:14px;text-align:center;color:#92400E;">
               <i class="fa-solid fa-circle-check" style="color:#059669;font-size:22px;display:block;margin-bottom:6px;"></i>
               <b>You are on the VIP App Waitlist!</b><br>
               <span style="font-size:12px;color:#78350F;">We have saved <code>${alreadyJoined}</code>. You will receive first notification upon Android & iOS store availability.</span>
             </div>`
          : `<p style="margin:0 0 10px;color:var(--muted);">Be the first to download the BrandGali mobile app for iPhone and Android with real-time push notifications, custom mall route maps, and offline sale trackers:</p>
             <form onsubmit="handleWaitlistSubmit(event)" style="display:flex;flex-direction:column;gap:8px;">
               <input type="text" id="waitlistInput" placeholder="Enter your email or phone number" required
                 style="width:100%;padding:12px 14px;border:1.5px solid var(--line);border-radius:10px;font-size:13px;font-family:inherit;outline:none;background:#FAFAFA;">
               <button type="submit" class="btn" style="background:var(--orange-deep);padding:12px;border-radius:10px;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;gap:6px;">
                 <i class="fa-solid fa-paper-plane"></i> Get Early VIP App Access
               </button>
             </form>`
        }
      </div>

      <div style="display:flex;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line);">
        <a href="brands.html" onclick="closeWaitlistModal()" class="btn" style="flex:1;text-align:center;background:var(--navy);padding:10px;font-size:12px;border-radius:10px;">
          <i class="fa-solid fa-sliders" style="margin-right:4px;"></i> Manage Brand Alerts
        </a>
        <button type="button" class="btn" onclick="closeWaitlistModal()" style="background:#E5E7EB;color:var(--navy);padding:10px 16px;font-size:12px;border-radius:10px;">
          Close
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  modal.onclick = (e) => {
    if (e.target === modal) closeWaitlistModal();
  };
}

function closeWaitlistModal() {
  const modal = document.getElementById('waitlistModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function handleWaitlistSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('waitlistInput');
  if (!input || !input.value.trim()) return;
  const val = input.value.trim();
  localStorage.setItem('brandgali_waitlist_email', val);
  showToast('<i class="fa-solid fa-circle-check"></i> Welcome to the BrandGali VIP App Waitlist!');
  openWaitlistModal();
}

// Global escape key handler for all modals
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBrandSaleModal();
      closeStoreLocationsModal();
      closeWaitlistModal();
    }
  });
}

// Expose all globals on window and signal data readiness
if (typeof window !== 'undefined') {
  window.CATEGORIES = CATEGORIES;
  window.BRANDS = BRANDS;
  window.loadSalesStatus = loadSalesStatus;
  window.openBrandSaleModal = typeof openBrandSaleModal === 'function' ? openBrandSaleModal : undefined;
  window.closeBrandSaleModal = typeof closeBrandSaleModal === 'function' ? closeBrandSaleModal : undefined;
  window.openStoreLocationsModal = typeof openStoreLocationsModal === 'function' ? openStoreLocationsModal : undefined;
  window.closeStoreLocationsModal = typeof closeStoreLocationsModal === 'function' ? closeStoreLocationsModal : undefined;
  window.openWaitlistModal = typeof openWaitlistModal === 'function' ? openWaitlistModal : undefined;
  window.closeWaitlistModal = typeof closeWaitlistModal === 'function' ? closeWaitlistModal : undefined;
  window.handleWaitlistSubmit = typeof handleWaitlistSubmit === 'function' ? handleWaitlistSubmit : undefined;
  window.showStoreDirections = typeof showStoreDirections === 'function' ? showStoreDirections : undefined;
  window.renderDealTimelinessBadge = typeof renderDealTimelinessBadge === 'function' ? renderDealTimelinessBadge : undefined;
  window.renderSkeletonCardsHTML = typeof renderSkeletonCardsHTML === 'function' ? renderSkeletonCardsHTML : undefined;
  window.openSearchOverlay = typeof openSearchOverlay === 'function' ? openSearchOverlay : undefined;
  window.closeSearchOverlay = typeof closeSearchOverlay === 'function' ? closeSearchOverlay : undefined;
  try {
    window.dispatchEvent(new CustomEvent('brandgali:data-ready', { detail: { brands: BRANDS, categories: CATEGORIES } }));
  } catch (e) {
    // ignore
  }
}
