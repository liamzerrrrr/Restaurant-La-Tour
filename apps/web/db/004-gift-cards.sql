BEGIN;
CREATE TABLE gift_cards (
 id uuid PRIMARY KEY,
 request_key uuid UNIQUE NOT NULL,
 fingerprint text NOT NULL,
 code_hash text UNIQUE NOT NULL,
 code_suffix text NOT NULL,
 initial_cents integer NOT NULL CHECK(initial_cents BETWEEN 100 AND 1000000),
 balance_cents integer NOT NULL CHECK(balance_cents>=0 AND balance_cents<=initial_cents),
 recipient text NOT NULL DEFAULT '',
 message text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT (now()+interval '1 year'),
 environment text NOT NULL DEFAULT 'test' CHECK(environment='test')
);
CREATE TABLE gift_transactions (
 id uuid PRIMARY KEY,
 gift_card_id uuid NOT NULL REFERENCES gift_cards,
 request_key uuid UNIQUE NOT NULL,
 amount_cents integer NOT NULL CHECK(amount_cents>0),
 note text NOT NULL DEFAULT '',
 at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX gift_transactions_card_date ON gift_transactions(gift_card_id,at DESC);
COMMIT;
