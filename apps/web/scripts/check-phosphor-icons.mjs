import * as ph from '@phosphor-icons/react';

const names = Object.keys(ph).filter(k => /^[A-Z]/.test(k) && !k.includes('Context') && !k.includes('Provider'));
const clothing = names.filter(n => 
  /shirt|sleeve|tank|crew|neck|jersey|short|jogger|vest|coat|jacket|blazer|sweater|sweat|cardigan|hoodie|pants|tshirt|dress|sneaker|hat|cap|bag/i.test(n)
);
console.log('Clothing-related Phosphor icons:', clothing);
console.log('Total icon exports:', names.length);
