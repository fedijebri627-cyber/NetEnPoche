-- Migration: Add IR Estimator fields to activity_config
-- Depends on: 20240101000000_init_schema

-- 1. Create enum for situation_familiale if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'situation_familiale_type') THEN
        CREATE TYPE situation_familiale_type AS ENUM ('celibataire', 'marie', 'pacse');
    END IF;
END
$$;

-- 2. Add new columns to activity_config
ALTER TABLE activity_config
ADD COLUMN IF NOT EXISTS situation_familiale situation_familiale_type DEFAULT 'celibataire',
ADD COLUMN IF NOT EXISTS parts_fiscales numeric DEFAULT 1,
ADD COLUMN IF NOT EXISTS autres_revenus numeric DEFAULT 0;
