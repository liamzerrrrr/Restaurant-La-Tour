ALTER TABLE reservations ADD COLUMN request_key uuid UNIQUE;
ALTER TABLE reservations ADD COLUMN request_fingerprint text;
