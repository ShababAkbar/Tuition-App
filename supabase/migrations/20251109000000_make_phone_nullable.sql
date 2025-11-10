-- Make phone column nullable in tutor table
ALTER TABLE tutor 
ALTER COLUMN phone DROP NOT NULL;

-- Update existing records with empty phone to NULL
UPDATE tutor 
SET phone = NULL 
WHERE phone = '' OR phone IS NOT NULL;
