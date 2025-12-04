#!/bin/bash
# Script to add security headers to all HTML files

SECURITY_HEADERS='    <!-- Security Headers -->
    <meta http-equiv="Content-Security-Policy" content="default-src '\''self'\''; style-src '\''self'\'' '\''unsafe-inline'\'' https://fonts.googleapis.com; font-src '\''self'\'' https://fonts.gstatic.com; script-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data:; connect-src '\''self'\''; frame-ancestors '\''none'\'';">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta http-equiv="Permissions-Policy" content="geolocation=(), camera=(), microphone=(), payment=()">'

echo "Adding security headers to HTML files..."

# Find all HTML files except index.html (already done)
for file in *.html; do
  if [ "$file" != "index.html" ]; then
    # Check if security headers already exist
    if grep -q "Security Headers" "$file"; then
      echo "⏭️  Skipping $file (headers already present)"
    else
      # Add headers after the first <meta> tag
      if grep -q "<meta" "$file"; then
        # Create temp file with headers inserted
        awk -v headers="$SECURITY_HEADERS" '
          /<meta/ && !found {
            print
            print ""
            print headers
            found=1
            next
          }
          {print}
        ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
        echo "✅ Added security headers to $file"
      else
        echo "⚠️  No <meta> tags found in $file - manual edit required"
      fi
    fi
  fi
done

echo ""
echo "================================================"
echo "Security headers added successfully!"
echo "================================================"
echo "Review the changes with: git diff"
echo "Test your site locally before committing"
echo "================================================"
