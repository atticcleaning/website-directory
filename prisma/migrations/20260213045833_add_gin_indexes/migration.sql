-- Enable pg_trgm extension for trigram fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create tsvector GIN indexes for full-text search on Listing
CREATE INDEX listing_name_search_idx ON "Listing" USING GIN (to_tsvector('english', name));
CREATE INDEX listing_address_search_idx ON "Listing" USING GIN (to_tsvector('english', address));

-- Create trigram GIN indexes for fuzzy matching on Listing
CREATE INDEX listing_name_trgm_idx ON "Listing" USING GIN (name gin_trgm_ops);
CREATE INDEX listing_address_trgm_idx ON "Listing" USING GIN (address gin_trgm_ops);
