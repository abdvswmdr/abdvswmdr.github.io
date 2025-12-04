#!/bin/bash
# Fix HTML validation errors

echo "Fixing HTML validation errors..."

# 1. Remove invalid Permissions-Policy meta tag from all HTML files
echo "Removing invalid Permissions-Policy meta tags..."
find . -maxdepth 1 -name "*.html" -type f | while read file; do
  if grep -q "Permissions-Policy" "$file"; then
    sed -i '/<meta http-equiv="Permissions-Policy"/d' "$file"
    echo "  Fixed: $file"
  fi
done

# 2. Fix character references (add missing semicolons)
echo ""
echo "Fixing character references..."
find . -maxdepth 1 -name "*.html" -type f -exec sed -i 's/&copy\([^;]\)/\&copy;\1/g' {} \;
find . -maxdepth 1 -name "*.html" -type f -exec sed -i 's/&nbsp\([^;]\)/\&nbsp;\1/g' {} \;
find . -maxdepth 1 -name "*.html" -type f -exec sed -i 's/&amp\([^;]\)/\&amp;\1/g' {} \;

echo ""
echo "================================================"
echo "Basic fixes applied!"
echo "================================================"
echo "Note: Structural issues (figcaption, iframe attributes)"
echo "require manual review in specific files."
echo ""
echo "Run 'git diff' to review changes"
echo "================================================"
