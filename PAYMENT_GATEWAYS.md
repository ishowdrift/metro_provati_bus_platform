# Metro Probati — Payment Gateways Integration Guide

## 1. Supported Providers
1. **bKash (বিকাশ) Merchant Payment**
2. **Nagad (নগদ) Merchant Gateway**
3. **Rocket (রকেট) / DBBL NexusPay**
4. **Cash at Counter (কাউন্টারে নগদ)**

## 2. Security Architecture
- **Never Request PIN or OTP**: Client screens NEVER prompt passengers for wallet PINs or SMS OTPs.
- **Server Verification**: In production, payments are validated server-to-server via REST webhook callbacks.
- **Sandbox Testing**: In development and demo environments, `/payment/sandbox-checkout` allows complete simulation of the payment cycle without real money transactions.

## 3. Switching from Sandbox to Production

Set environment variables in `.env.local` or Vercel Project Settings:

```env
# bKash Production
BKASH_CHECKOUT_APP_KEY=your_production_app_key
BKASH_CHECKOUT_APP_SECRET=your_production_app_secret
BKASH_CHECKOUT_USERNAME=your_merchant_username
BKASH_CHECKOUT_PASSWORD=your_merchant_password
BKASH_IS_SANDBOX=false

# Nagad Production
NAGAD_MERCHANT_ID=your_merchant_id
NAGAD_PUBLIC_KEY=your_pg_public_key
NAGAD_PRIVATE_KEY=your_pg_private_key
NAGAD_IS_SANDBOX=false
```
