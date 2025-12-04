#!/bin/bash

# Fix iframe attributes in PortfolioDetails1.html
sed -i 's/width="90%"/style="width:90%;"/g' PortfolioDetails1.html
sed -i 's/height="600px"/height:600px;"/g' PortfolioDetails1.html  
sed -i 's/ frameborder="0"//g' PortfolioDetails1.html

# Fix <br> in <ol> for PortfolioDetails4.html
sed -i '/<ol>/,/<\/ol>/{s/<br>//g}' PortfolioDetails4.html

echo "Structural fixes applied!"
echo "Remaining issues require manual review of figcaption placement"
