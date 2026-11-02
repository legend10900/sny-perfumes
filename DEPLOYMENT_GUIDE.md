# ⚜️ SNY PERFUMES — DEPLOYMENT & INTEGRATION GUIDE
### Direct UPI (0% Fee) & Automated Shiprocket Logistics

Welcome to **SNY Perfumes** (*"Wear Your Signature — Scent. Style. Statement."*). This guide details running the application, deploying to Vercel, and configuring **Direct UPI payments**, **Supabase**, and **Shiprocket**.

---

## 1. Zero Fee Architecture Overview

- **No Third-Party Gateway Fees:** 0% deductions via standard NPCI Direct UPI (`upi://` deep-link & QR code).
- **Payment Modes:**
  1. **Direct UPI:** Generates NPCI deep-link on mobile (GPay, PhonePe, Paytm, CRED) and on-screen QR Code on desktop via `qrcode.react`. Customer enters their 12-digit UTR number from their payment receipt.
  2. **Cash on Delivery (COD):** Available for customers who prefer doorstep payment.
- **Shiprocket Automation:**
  - **COD Orders:** Automatically booked and dispatched via Shiprocket immediately.
  - **Direct UPI Orders:** Once the store owner verifies the UTR at `/admin/orders`, hitting "Verify" triggers automated Shiprocket shipment booking with `payment_method: "Prepaid"`.
  - The live tracking URL (`https://shiprocket.co/tracking/{shipment_id}`) and AWB code are saved directly to the customer's Supabase order.

---

## 2. Quick Start (Run Locally)

```bash
# 1. Install dependencies
npm install

# 2. Run local Next.js server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Order Tracking:** [http://localhost:3000/track-order](http://localhost:3000/track-order)
- **Admin Verification Portal:** [http://localhost:3000/admin/orders](http://localhost:3000/admin/orders)

---

## 3. Connecting Supabase

### Step 1: Create a Project
1. Log in at [supabase.com](https://supabase.com) and create a new project.

### Step 2: Run Database Schema
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open `supabase/schema.sql` from this codebase, copy the contents, and click **Run**.
3. This creates:
   - `products` (seeded with all 9 signature perfumes with their exact notes & accents)
   - `orders` (with customer details, UTR number, payment method, and Shiprocket tracking fields)
   - `order_items` (with relations to orders and products)

### Step 3: Copy API Keys
In **Project Settings > API**, copy:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 4. Configuring Direct UPI

In your `.env.local` or Vercel environment:
```env
NEXT_PUBLIC_UPI_ID="yourbusinessname@okaxis" # Replace with your actual merchant or personal UPI ID
```

When customers check out:
- **Mobile Users:** Tap to open GPay, PhonePe, Paytm, or CRED with amount & order note pre-filled.
- **Desktop Users:** Scan the dynamic on-screen QR Code.
- After transferring, they paste their 12-digit UPI Reference / UTR Number.

---

## 5. Connecting Shiprocket

1. Sign up or log in at [app.shiprocket.in](https://app.shiprocket.in).
2. Go to **Settings > Pickup Addresses** to check your warehouse name (e.g., `Primary_Warehouse`).
3. Set your environment variables:
   ```env
   SHIPROCKET_EMAIL="your_shiprocket_email@example.com"
   SHIPROCKET_PASSWORD="your_shiprocket_password"
   SHIPROCKET_PICKUP_LOCATION="Primary_Warehouse"
   ```

### Verification & Dispatch Flow:
1. Open the Admin Operations Portal at `/admin/orders`.
2. Review new Direct UPI orders with customer name, phone, and 12-digit UTR.
3. Click **"Verify & Dispatch via Shiprocket"**.
4. The system automatically calls Shiprocket's ad-hoc shipment API, generates the AWB, and updates the customer's order with the live tracking URL!

---

## 6. Deploying to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: direct UPI and automated Shiprocket logistics"
git push origin main
```

### Step 2: Import on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and select `sny-perfumes`.
2. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_UPI_ID`
   - `SHIPROCKET_EMAIL`
   - `SHIPROCKET_PASSWORD`
   - `SHIPROCKET_PICKUP_LOCATION`
3. Click **Deploy**. Vercel will build and assign your production domain.
