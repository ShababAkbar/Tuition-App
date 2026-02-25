-- Fix duplicate username issue by using email as username
-- This migration updates the handle_new_user trigger function
-- Names can be duplicate, but email is always unique

-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- Recreate the function using email as username (which is always unique)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the user profile with email as username (email is already unique)
  INSERT INTO public.user_profiles (id, email, username, user_type, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email,  -- Use email as username since it's unique
    COALESCE(NEW.raw_user_meta_data->>'role', 'tutor'),
    NEW.phone
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
