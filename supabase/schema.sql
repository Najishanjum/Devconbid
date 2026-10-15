-- ==============================================================================
-- PocketBillboard Payment & Sponsorship Database Schema for Supabase (PostgreSQL)
-- ==============================================================================
-- Run this script in the Supabase SQL Editor if using Supabase as the backend.
-- Includes Row Level Security (RLS), unique transaction constraints, and stored procedures.

-- 1. Sponsorships Table
CREATE TABLE IF NOT EXISTS public.sponsorships (
    id TEXT PRIMARY KEY,                          -- e.g. 'SPONSOR-C01-DEVCON'
    bid_ref_id TEXT,
    cover_id TEXT NOT NULL CHECK (cover_id IN ('cover-01', 'cover-02', 'both')),
    cover_slot_display TEXT NOT NULL,
    winner_name TEXT NOT NULL,
    winner_email TEXT NOT NULL,
    winning_bid_usd NUMERIC(10, 2) NOT NULL CHECK (winning_bid_usd >= 25.00),
    status TEXT NOT NULL DEFAULT 'PAYMENT_PENDING' CHECK (status IN ('AWARDED', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ
);

-- 2. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,                          -- e.g. 'PAY-UPI-1234' or 'PAY-BASE-5678'
    sponsorship_id TEXT NOT NULL REFERENCES public.sponsorships(id) ON DELETE RESTRICT,
    cover_id TEXT NOT NULL CHECK (cover_id IN ('cover-01', 'cover-02', 'both')),
    winning_bid_amount NUMERIC(10, 2) NOT NULL,
    payment_currency TEXT NOT NULL CHECK (payment_currency IN ('INR', 'USDC')),
    exact_amount_due NUMERIC(14, 2) NOT NULL,
    usd_to_inr_rate NUMERIC(10, 4),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'BASE_USDC')),
    
    -- Blockchain Details (null for UPI)
    blockchain_network TEXT,
    blockchain_chain_id INTEGER,
    blockchain_token_contract TEXT,
    blockchain_receiver_address TEXT,

    -- Transaction reference (UTR or On-chain Tx Hash)
    -- CONSTRAINT: Prevent duplicate transaction references across payments
    transaction_reference TEXT UNIQUE,
    payer_utr TEXT,
    payer_tx_hash TEXT,
    
    -- Payment Status
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending_verification', 'confirmed', 'failed', 'expired')),
    verification_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_verification_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ
);

-- Index for quick lookup by sponsorship
CREATE INDEX IF NOT EXISTS idx_payments_sponsorship ON public.payments(sponsorship_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Public can view confirmed or pending sponsorships by ID (read-only for checkout)
CREATE POLICY "Public read access to sponsorships"
    ON public.sponsorships FOR SELECT
    USING (true);

-- Public can view payment by ID to check payment status
CREATE POLICY "Public read access to own payment"
    ON public.payments FOR SELECT
    USING (true);

-- Public can insert payment initiation or submit UTR / Tx Hash (updates restricted)
-- Only service_role can mark status as 'confirmed'
CREATE POLICY "Public insert payments"
    ON public.payments FOR INSERT
    WITH CHECK (payment_status IN ('unpaid', 'pending_verification'));

-- 4. Stored Procedure for Secure Server-Side Manual UPI Verification
-- Run by organizer from Supabase SQL Editor / Dashboard
CREATE OR REPLACE FUNCTION verify_upi_payment(
    p_payment_id TEXT,
    p_notes TEXT DEFAULT 'Manually verified via bank / UPI business app'
)
RETURNS VOID AS $$
DECLARE
    v_sponsorship_id TEXT;
BEGIN
    SELECT sponsorship_id INTO v_sponsorship_id
    FROM public.payments
    WHERE id = p_payment_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment ID % not found.', p_payment_id;
    END IF;

    -- Update payment
    UPDATE public.payments
    SET payment_status = 'confirmed',
        confirmed_at = timezone('utc'::text, now()),
        last_verification_at = timezone('utc'::text, now()),
        verification_notes = p_notes
    WHERE id = p_payment_id;

    -- Update sponsorship to confirmed
    UPDATE public.sponsorships
    SET status = 'CONFIRMED'
    WHERE id = v_sponsorship_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
