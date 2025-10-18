-- Add delivery_link column to orders table for service delivery
ALTER TABLE public.orders ADD COLUMN delivery_link text;

-- Add comment for clarity
COMMENT ON COLUMN public.orders.delivery_link IS 'Link to download or access the delivered service/files';