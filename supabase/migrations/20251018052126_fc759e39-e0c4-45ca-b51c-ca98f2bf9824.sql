-- Add social media and contact fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS discord_id text,
ADD COLUMN IF NOT EXISTS instagram_id text,
ADD COLUMN IF NOT EXISTS linkedin_id text;

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, discord_id, instagram_id, linkedin_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'discord_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'instagram_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'linkedin_id', '')
  )
  ON CONFLICT (id) 
  DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    discord_id = COALESCE(EXCLUDED.discord_id, profiles.discord_id),
    instagram_id = COALESCE(EXCLUDED.instagram_id, profiles.instagram_id),
    linkedin_id = COALESCE(EXCLUDED.linkedin_id, profiles.linkedin_id);
  RETURN NEW;
END;
$function$;