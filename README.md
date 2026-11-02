# ⚜️ SNY PERFUMES — Haute Parfumerie E-Commerce

> *"Wear Your Signature — Scent. Style. Statement."*

A luxury, production-grade e-commerce web platform for **SNY Perfumes**, crafted with Next.js 14 App Router, Tailwind CSS, TypeScript, Zustand, Supabase, Shiprocket, and Razorpay.

---

## ✨ Features Implemented

1. **Dark Luxury Aesthetic:**
   - Pure black background (`#000000`), zinc containers (`#09090b`, `#18181b`), and warm metallic gold accents (`#D4AF37`, `#f59e0b`).
   - Playfair Display serif headings with crisp Inter body typography.

2. **Atelier Navigation:**
   - Minimalist gold-accented logo, quick links (All Scents, Best Sellers, Discovery Sets, Track Order).
   - Live sliding cart drawer with real-time badge count and free shipping indicator.

3. **Hero Section:**
   - Framed portrait of the Brand Ambassador holding Midnight Oud (`/branding/hero-model.jpg`) with ambient gold aura glow.
   - Core value props: French Perfume Oils, 12+ Hours Certified Longevity, Beast-mode Projection, Luxury Unisex Formulations.

4. **Vertical Video Reels Showcase:**
   - 2-Column 9:16 vertical video reel cards embedding `/branding/video-reel-signature.mp4` and `/branding/video-reel-lifestyle.mp4`.
   - Autoplay, loop, sound toggle, play/pause state, and frosted-glass overlay cards.

5. **Curated Product Catalog Grid (9 Fragrances + Asphalt):**
   - **Titan Aura:** Inspired by Creed Aventus (Pineapple, Birch, Ambergris)
   - **Aqua Tide:** Inspired by Davidoff Cool Water (Marine Accord, Lavender, Cedarwood)
   - **Midnight Oud:** Inspired by Lamsa Harir (Saffron, Oud, Amber)
   - **Silk Oud:** Inspired by Oud Bushra Habib (Saffron, Oud, Sandalwood)
   - **Shadow Lust:** Inspired by Azzaro Most Wanted (Lemon, Caramel, Vetiver)
   - **Floral Desire:** Inspired by Gucci Flora (Peony, Rose, Sandalwood)
   - **Arabian Gold:** Inspired by Swiss Arabian (Cardamom, Oud, Musk)
   - **Signature:** Inspired by Hugo Boss (Apple, Geranium, Sandalwood)
   - **Red Aura:** Inspired by Red Diamond (Blood Orange, Rose, Oud)
   - **Asphalt (Exclusive):** Inspired by Harley Davidson (Raw Leather, Amber, Vetiver)
   - Dynamic 30ml / 50ml flacon size selection, strike-through prices, and quick Add-to-Cart.

6. **Interactive Olfactory Fragrance Pyramid Modal:**
   - Maps Top Notes (0-15m), Heart Notes (2-4h), and Base Notes (6+h) with color-matched pill badges.
   - Conforms strictly to modern web standards (`<dialog closedby="any">`, overscroll containment, and accessible keyboard focus).

7. **Special Bundles & Vaults:**
   - 30ml single (₹349), 50ml single (₹499), Duo pack (2x 30ml for ₹600 / 2x 50ml for ₹800), and Discovery Set (4x 8ml for ₹399).

8. **Zustand Slide-Out Bag (Cart):**
   - Sliding right drawer with backdrop blur, item quantity controls, subtotal calculation, and interactive free shipping progress bar.

9. **Checkout & Payment Engine:**
   - Complete address form (Name, Email, Phone, Street, City, State, Pincode).
   - Payment method toggle: Razorpay (Prepaid UPI/Cards) and Cash on Delivery (COD).
   - Razorpay Webhook route (`/api/webhooks/razorpay`) with HMAC SHA256 verification.
   - Automated Shiprocket adhoc shipment generation (`POST /v2/ks/order/create/adhoc`).

10. **Live Order Tracking (`/track-order`):**
    - Search by Order ID (e.g., `SNY-2026-9842`) or Phone number.
    - Live progression timeline: Confirmed ➔ Dispatched ➔ In Transit ➔ Out for Delivery ➔ Delivered.
    - Direct link to live Shiprocket tracking.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the luxury boutique.

For production deployment instructions and setting up Supabase, Razorpay, and Shiprocket, see [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md).
