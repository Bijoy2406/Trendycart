import p1_img from "./product_1.png";
import p2_img from "./product_2.png";
import p3_img from "./product_3.png";
import p4_img from "./product_4.png";
import p5_img from "./product_5.png";
import p6_img from "./product_6.png";
import p7_img from "./product_7.png";
import p8_img from "./product_8.png";
import p9_img from "./product_9.png";
import p10_img from "./product_10.png";
import p11_img from "./product_11.png";
import p12_img from "./product_12.png";
import p13_img from "./product_13.png";
import p14_img from "./product_14.png";
import p15_img from "./product_15.png";
import p16_img from "./product_16.png";
import p17_img from "./product_17.png";
import p18_img from "./product_18.png";
import p19_img from "./product_19.png";
import p20_img from "./product_20.png";
import p21_img from "./product_21.png";
import p22_img from "./product_22.png";
import p23_img from "./product_23.png";
import p24_img from "./product_24.png";
import p25_img from "./product_25.png";
import p26_img from "./product_26.png";
import p27_img from "./product_27.png";
import p28_img from "./product_28.png";
import p29_img from "./product_29.png";
import p30_img from "./product_30.png";
import p31_img from "./product_31.png";
import p32_img from "./product_32.png";
import p33_img from "./product_33.png";
import p34_img from "./product_34.png";
import p35_img from "./product_35.png";
import p36_img from "./product_36.png";

const generatePrices = () => {
  const prices = [];
  for (let i = 0; i < 36; i++) {
    let old_price = Math.floor(Math.random() * 300) + 300; // old_price between 300 and 599
    let new_price = Math.floor(Math.random() * (old_price - 200)) + 200; // new_price less than old_price, and at least 200
    prices.push({ new_price, old_price });
  }
  return prices;
};

const priceList = generatePrices();

let all_product = [
  {
    id: 1,
    name: "Readymade Stylish Fashionable Koti Hot Kurti For Girls Long Pure Soft Linen (1 Pcs) KT-10",
    category: "women",
    image: p1_img,
    ...priceList[0],
},
{
    id: 2,
    name: "New designed1piece long kurti different kurti long kurti For Stylish Women Girls",
    category: "women",
    image: p2_img,
    ...priceList[1],
},
{
    id: 3,
    name: "China Linen Fabrics Glorious Designed Gown 1piece long kurti different koti, Gown long kurti For Stylish Women / Girls",
    category: "women",
    image: p3_img,
    ...priceList[2],
},
{
    id: 4,
    name: "New Readymade Kurtis Stylish Hot Kurtis For Women Long Linen Kurtis One Piece - Dress For Girls - Versatile for Every Season and Occasion",
    category: "women",
    image: p4_img,
    ...priceList[3],
},
{
    id: 5,
    name: "Diamond Georgette Two Piece",
    category: "women",
    image: p5_img,
    ...priceList[4],
},
{
    id: 6,
    name: "Exclusive Designed Gown 1Piece Long Kurti Different Koti, Gown Long Kurti For Stylish Women / Girls - Tops For Girls Long Kurti",
    category: "women",
    image: p6_img,
    ...priceList[5],
},
{
    id: 7,
    name: "Linen Ready-Made Gown Designed Long Salwar Kameez Orna - Elegant Three-Piece Dress for Stylish Women/Girls",
    category: "women",
    image: p7_img,
    ...priceList[6],
},
{
    id: 8,
    name: "Readymade Three Pieces Les Work Linen Stitched Kurti Shalwar Kameez For Stylish Women - Perfect for Casual and Party Attire Shalwar Kameez",
    category: "women",
    image: p8_img,
    ...priceList[7],
},
{
    id: 9,
    name: "New colletion three pice jama geogette beautiful design looking so wonderfull high quality woman dress",
    category: "women",
    image: p9_img,
    ...priceList[8],
},
{
    id: 10,
    name: "New Exclusive Designed Linen Gown 3-Piece Long Kurti for Stylish Women/Girls - Perfect for Any Occasion",
    category: "women",
    image: p10_img,
    ...priceList[9],
},

  {
    id: 13,
    name: "Beautiful and Peaceful Islam Printed Casual T-Shirt For Man - A Round Neck Casual Wear Reflecting Your Cultural Identity",
    category: "men",
    image: p13_img,
    ...priceList[12],
},
{
    id: 14,
    name: "Stylish Unisex White And Ash Color Tshirts - Tshirt For Men",
    category: "men",
    image: p14_img,
    ...priceList[13],
},
{
    id: 15,
    name: "Jersey T-Shirt For Man | Half Hand T Shirt For Men",
    category: "men",
    image: p15_img,
    ...priceList[14],
},
{
    id: 16,
    name: "Summer Printed Combo T-Shirt & Pant - Black - T-Shirt - T Shirt For Man - T Shirt For Man - T Shirt For Man",
    category: "men",
    image: p16_img,
    ...priceList[15],
},
{
    id: 17,
    name: "Men's Casual Full Sleeve Shirt for Men by Signature Styles",
    category: "men",
    image: p17_img,
    ...priceList[16],
},
{
    id: 18,
    name: "Stylish Trendy Cotton Oxford Long Sleeve Formal Shirt For Men",
    category: "men",
    image: p18_img,
    ...priceList[17],
},
{
    id: 19,
    name: "men new 2024 Trendy Fashionable Trendy Design Digital Printed Boys T-Shirt for men new 2024 - Artful Fashion for Casual Occasions and Moderate Weather",
    category: "men",
    image: p19_img,
    ...priceList[18],
},
{
    id: 20,
    name: "New Stylish & Smart Looking Trendy Cotton Oxford Long Sleeve Casual Shirt For Men By SALMA XPORT (LX)",
    category: "men",
    image: p20_img,
    ...priceList[19],
},
{
    id: 21,
    name: "Men's Stylish & Fashionable Trendy Good Looking Long Sleeve Formal Shirt",
    category: "men",
    image: p21_img,
    ...priceList[20],
},
{
    id: 22,
    name: "Men's Stylish & Fashionable Trendy Good Looking Long Sleeve Formal Shirt",
    category: "men",
    image: p22_img,
    ...priceList[21],
},

{
  id: 25,
  name: "Export High Quality Boy Kids Smart Shirt/Summer Shirt For Boy Baby/Kids Shirt",
  category: "kid",
  image: p25_img,
  ...priceList[24],
},
{
  id: 26,
  name: "Exclusive Design Shirt Romper for baby boys Premium quality party dress for kids suspender set",
  category: "kid",
  image: p26_img,
  ...priceList[25],
},
{
  id: 27,
  name: "BABY BOYS/KIDS CASUAL STYLISH EXCLUSIVE DRESS SET (T-SHIRT & HALF PANT)",
  category: "kid",
  image: p27_img,
  ...priceList[26],
},
{
  id: 28,
  name: "Export High Quality Boy Kids Fashionable Romper Full Set/Baby Party Dress/Kids Smart Party Dress",
  category: "kid",
  image: p28_img,
  ...priceList[27],
},
{
  id: 29,
  name: "KIDS PATRY DRESS COMBO SET 6 month to 6 years ( full shirt + full pant +koti+ bow tie / cat tie )",
  category: "kid",
  image: p29_img,
  ...priceList[28],
},
{
  id: 30,
  name: "Export High Quality T Shirt Set For Boy Baby/T Shirt Set With Half Pant/Kids Smart T Shirt Set",
  category: "kid",
  image: p30_img,
  ...priceList[29],
},
{
  id: 31,
  name: "Export High Quality Boy & Girls Kids Smart Shirt/Summer Shirt For Boy Baby/Kids Shirt",
  category: "kid",
  image: p31_img,
  ...priceList[30],
},
{
  id: 32,
  name: "BABY BOYS/KIDS CASUAL STYLISH EXCLUSIVE DRESS SET (T-SHIRT & HALF PANT)",
  category: "kid",
  image: p32_img,
  ...priceList[31],
},
{
  id: 33,
  name: "2-4 Yrs Little Bitty Toddler Boys Designer Clothes Kids Summer Dress 2024 T-Shirt Shorts  2 Piece Clothing Set",
  category: "kid",
  image: p33_img,
  ...priceList[32],
},
{
  id: 34,
  name: "6 Pieces Multi Color Cotton Boy Half T-shirt By Any Color And Printe",
  category: "kid",
  image: p34_img,
  ...priceList[33],
},
{
  id: 35,
  name: "6 Pieces Multi Color Stripe Cotton Magi T-shirt for baby kids",
  category: "kid",
  image: p35_img,
  ...priceList[34],
},
{
  id: 36,
  name: "Kids Fashionable Rampar Dress for baby, dress for boy baby party 6 month 18 month",
  category: "kid",
  image: p36_img,
  ...priceList[35],
},

];

export default all_product;
