# ⚜️ SNY PERFUMES — DEPLOYMENT & INTEGRATION GUIDE

Welcome to **SNY Perfumes** (*"Wear Your Signature — Scent. Style. Statement."*). This guide walks you through running the website locally, deploying to Vercel, and connecting the production backends (**Supabase**, **Razorpay**, and **Shiprocket**).

---

## 1. Quick Start (Run Locally)

### Prerequisites:
- Node.js 18+ or 20+
- In Windows PowerShell, if scripts are restricted, run with `npm.cmd`:

```bash
# Install dependencies
npm install

# Start local Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Brand Assets:**
> The ambassador photo (`/branding/hero-model.jpg`), product photos (`/branding/titan-aura.jpg`, `/branding/aqua-tide.jpg`, `/branding/asphalt.jpg`), and 9:16 vertical video reels (`/branding/video-reel-signature.mp4`, `/branding/video-reel-lifestyle.mp4`) are stored directly in `public/branding/` and are active immediately.

---

## 2. Deploying to Vercel

### Option A: Via GitHub (Recommended)
1. Initialize git and push to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SNY Perfumes luxury e-commerce platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sny-perfumes.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and select your repository.
3. In **Environment Variables**, add the keys described in Section 3, 4, and 5 below.
4. Click **Deploy**. Vercel will build and assign your production domain.

### Option B: Via Vercel CLI
```bash
npx vercel
# Follow the interactive prompts to link and deploy to production
npx vercel --prod
```

---

## 3. Connecting Supabase (Database & Orders)

### Step 1: Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com) and click **New Project**.
2. Name your project `SNY-Perfumes` and set a secure database password.

### Step 2: Run the Database Schema
1. Open the **SQL Editor** in your Supabase Dashboard.
2. Open `supabase/schema.sql` from this codebase, copy the entire SQL script, and click **Run**.
3. This creates:
   - The `orders` table (with customer details, order items, prices, payment status, and courier tracking details).
   - High-performance indexes on `order_number` and `created_at`.
   - Row Level Security (RLS) policies allowing public tracking queries and authorized server updates.

### Step 3: Copy Environment Variables
Go to **Project Settings > API** and copy:
- **Project URL** ➡️ `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** ➡️ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret** ➡️ `SUPABASE_SERVICE_ROLE_KEY`

Add these into your `.env.local` and in Vercel project settings.

---

## 4. Connecting Razorpay (Prepaid UPI, Cards & Webhooks)

### Step 1: Generate API Keys
1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com) and navigate to **Account & Settings > API Keys**.
2. Click **Generate Key** (Use Test Key for sandbox, Live Key for production).
3. Save:
   - `Key ID` ➡️ `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `Key Secret` ➡️ `RAZORPAY_KEY_SECRET`

### Step 2: Configure the Automated Webhook
1. In the Razorpay Dashboard, go to **Settings > Webhooks > Add New Webhook**.
2. **Webhook URL**:
   `https://<your-vercel-domain>.vercel.app/api/webhooks/razorpay`
3. **Secret**: Set a secure secret string (e.g. `sny_razorpay_secret_2026`).
   - Add this secret to your environment: `RAZORPAY_WEBHOOK_SECRET=sny_razorpay_secret_2026`
4. **Active Events**: Select:
   - `payment.captured`
   - `order.paid`
5. Save the Webhook.

#### How It Works:
- When a customer completes payment via UPI or Cards, Razorpay dispatches a webhook to `/api/webhooks/razorpay`.
- The webhook verifies the **HMAC SHA256** signature against `RAZORPAY_WEBHOOK_SECRET`.
- It updates the order status to `PAID` in Supabase.
- It immediately invokes **Shiprocket's automated order creation endpoint** (`POST /v2/ks/order/create/adhoc`).
- The courier `order_id`, `shipment_id`, and live tracking URL are saved to Supabase!

---

## 5. Connecting Shiprocket (Automated Courier Logistics)

### Step 1: Shiprocket Account & Warehouse
1. Sign up or log in to [app.shiprocket.in](https://app.shiprocket.in).
2. Go to **Settings > Pickup Addresses** and verify your warehouse name (e.g., `Primary_Warehouse`).

### Step 2: Configure API Credentials
In your `.env.local` or Vercel environment:
```env
SHIPROCKET_EMAIL="your_registered_shiprocket_email@example.com"
SHIPROCKET_PASSWORD="your_shiprocket_password"
SHIPROCKET_PICKUP_LOCATION="Primary_Warehouse"
```

### Step 3: Automated Flow
- **Prepaid Orders**: Generated when the Razorpay payment or webhook confirms.
- **Cash On Delivery (COD)**: Generated immediately when customer confirms checkout.
- Shiprocket books the parcel, creates the AWB, and generates the live tracking URL: `https://shiprocket.co/tracking/{shipment_id}`.

---

## 6. Real-time Order Tracking Testing

- You can immediately test tracking at [http://localhost:3000/track-order](http://localhost:3000/track-order).
- A pre-seeded active test shipment is provided:
  - **Order ID**: `SNY-2026-9842`
  - **Phone**: `9876543210`
- Placed orders will also appear automatically in real-time!

---

## 7. Complete Environment Variables Checklist

| Variable | Description | Where to find |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base application URL | e.g. `https://snyperfumes.com` or `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL | Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key | Supabase Dashboard > Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side elevated key | Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID | Razorpay Dashboard > Settings > API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Razorpay Dashboard > Settings > API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret | Razorpay Dashboard > Settings > Webhooks |
| `SHIPROCKET_EMAIL` | Shiprocket account email | Shiprocket login email |
| `SHIPROCKET_PASSWORD` | Shiprocket password | Shiprocket account password |
| `SHIPROCKET_PICKUP_LOCATION` | Registered Pickup Location | Shiprocket Settings > Pickup Addresses |
