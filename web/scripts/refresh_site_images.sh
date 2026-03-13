#!/usr/bin/env bash
set -euo pipefail

# Downloads curated real-estate photos from Pexels and writes local JPG images
# into `web/public/uploads/**` so the site works without external hotlinks at runtime.
#
# Requirements: curl

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_LISTINGS="$ROOT_DIR/public/uploads/listings"
OUT_HERO="$ROOT_DIR/public/uploads/hero"
OUT_CATEGORIES="$ROOT_DIR/public/uploads/categories"

mkdir -p "$OUT_LISTINGS" "$OUT_HERO" "$OUT_CATEGORIES"

tmpdir="$(mktemp -d)"
cleanup() { rm -rf "$tmpdir"; }
trap cleanup EXIT

fetch_file() {
  local url="$1"
  local out="$2"

  curl -fsSL --retry 3 --retry-delay 1 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" "$url" -o "$out"
}

# Listing images (1200x900)
LISTING_ENTRIES=(
  "apartment-modern.jpg|https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "apartment-cozy.jpg|https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "apartment-luxury.jpg|https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"

  "house-exterior.jpg|https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "house-cottage.jpg|https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "house-modern.jpg|https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"

  "land-green.jpg|https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "land-field.jpg|https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"

  # Additional gallery assets used by mock data
  "apartment-1.jpg|https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "apartment-2.jpg|https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "apartment-cozy-2.jpg|https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "apartment-luxury-1.jpg|https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "apartment-studio-3.jpg|https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"

  "house-1.jpg|https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "house-2.jpg|https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "house-cottage-1.jpg|https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "house-modern-2.jpg|https://images.pexels.com/photos/1396120/pexels-photo-1396120.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "house-villa-3.jpg|https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"

  "land-1.jpg|https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "land-2.jpg|https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "land-plot-1.jpg|https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "land-plot-2.jpg|https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "land-commercial.jpg|https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
)

echo "Refreshing listing images..."
for entry in "${LISTING_ENTRIES[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  echo "  - $name"
  fetch_file "$url" "$OUT_LISTINGS/$name"
done

# Category images (1200x900)
CATEGORY_ENTRIES=(
  "category-apartments.jpg|https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "category-houses.jpg|https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "category-land.jpg|https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
  "category-commercial.jpg|https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
)

echo "Refreshing category images..."
for entry in "${CATEGORY_ENTRIES[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  echo "  - $name"
  fetch_file "$url" "$OUT_CATEGORIES/$name"
done

# Hero images (2560x1440)
HERO_ENTRIES=(
  "hero-1.jpg|https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=2560&h=1440&fit=crop"
  "hero-2.jpg|https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=2560&h=1440&fit=crop"
  "hero-3.jpg|https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=2560&h=1440&fit=crop"
)

echo "Refreshing hero images..."
for entry in "${HERO_ENTRIES[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  echo "  - $name"
  fetch_file "$url" "$OUT_HERO/$name"
done

echo "Done."
