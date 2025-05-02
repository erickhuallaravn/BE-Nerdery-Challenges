/*
    Challenge: Implement a Secure Fund Transfer Function

    In this challenge, you will implement a PostgreSQL stored function to simulate transferring funds 
    between two accounts in a banking system. The function must follow proper validation, ensure data 
    integrity, and log transactions with a shared reference.

    Your function should be named:
    banking.transfer_funds(from_id INT, to_id INT, amount NUMERIC)

    The function must:

    - Prevent transfers to the same account
    - Ensure the transfer amount is greater than zero
    - Validate that both sender and recipient accounts exist
    - Prevent transfers if either account is marked as "frozen"
    - Ensure the sender has sufficient funds
    - Debit the sender and credit the recipient atomically
    - Log two transactions: a withdrawal and a deposit, both linked by the same UUID reference
    - Raise meaningful exceptions for all validation failures

    The function should perform all operations within a safe transactional context, maintaining 
    database consistency even in the event of failure.

    Notes:
    - In order to test you can mock some additional data in the tables that participates in this challenge.
    - Make sure of raising errors when they're present

    ERD:
    +---------------------+            +--------------------------+
    |     accounts        |            |      transactions        |
    +---------------------+            +--------------------------+
    | account_id (PK)     |<-----------| transaction_id (PK)      |
    | balance             |            | account_id (FK)          |
    | status              |            | amount                   |
    +---------------------+            | transaction_type         |
                                       | reference                |
                                       | transaction_date         |
                                       +--------------------------+
*/

CREATE OR REPLACE FUNCTION banking.transfer_funds(
    from_id INT,
    to_id INT,
    amount NUMERIC
)
RETURNS VOID AS $$
DECLARE
    from_balance NUMERIC;
    from_status TEXT;
    to_status TEXT;
    shared_reference UUID := gen_random_uuid();
BEGIN
    -- Validate different accounts
    IF from_id = to_id THEN
        RAISE EXCEPTION 'Cannot transfer to the same account';
    END IF;

    -- Validate positive amount
    IF amount <= 0 THEN
        RAISE EXCEPTION 'Transfer amount must be greater than zero';
    END IF;

    -- Check sender account exists and fetch balance (for later usage) and status
    SELECT balance, status INTO from_balance, from_status
    FROM banking.accounts
    WHERE account_id = from_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sender account % does not exist', from_id;
    END IF;

    -- Check recipient account exists and fetch status
    SELECT status INTO to_status
    FROM banking.accounts
    WHERE account_id = to_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Recipient account % does not exist', to_id;
    END IF;

    -- Check both accounts are active
    IF from_status = 'frozen' THEN
        RAISE EXCEPTION 'Sender account % is frozen', from_id;
    END IF;
    IF to_status = 'frozen' THEN
        RAISE EXCEPTION 'Recipient account % is frozen', to_id;
    END IF;

    -- Check sufficient funds
    IF from_balance < amount THEN
        RAISE EXCEPTION 'Insufficient funds in account %', from_id;
    END IF;

    PERFORM pg_advisory_xact_lock(from_id, to_id);

    UPDATE banking.accounts
    SET balance = balance - amount
    WHERE account_id = from_id;

    UPDATE banking.accounts
    SET balance = balance + amount
    WHERE account_id = to_id;

    INSERT INTO banking.transactions (account_id, amount, transaction_type, reference, transaction_date)
    VALUES (from_id, amount, 'withdrawal', shared_reference, CURRENT_TIMESTAMP);
    
    INSERT INTO banking.transactions (account_id, amount, transaction_type, reference, transaction_date)
    VALUES (to_id, amount, 'deposit', shared_reference, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Mocked data to create testing cases
DELETE FROM banking.transactions;
DELETE FROM banking.accounts;
INSERT INTO banking.accounts (account_id, balance, status) VALUES
(1, 1000.00, 'active'),
(2, 500.00,  'active'),
(3, 50.00,   'active'),
(4, 300.00,  'frozen'),
(5, 2000.00, 'active');

SELECT banking.transfer_funds(1, 1, 100);
-- Expected Error: Cannot transfer to the same account

SELECT banking.transfer_funds(1, 2, 0);
-- Expected Error: Transfer amount must be greater than zero

SELECT banking.transfer_funds(999, 2, 100);
-- Expected Error: Sender account 999 does not exist

SELECT banking.transfer_funds(1, 999, 100);
-- Expected Error: Recipient account 999 does not exist

-- We froze the account 1 temporaly
UPDATE banking.accounts SET status = 'frozen' WHERE account_id = 1;
SELECT banking.transfer_funds(1, 2, 100);
-- Expected Error: Sender account 1 is frozen
-- We revert to active state
UPDATE banking.accounts SET status = 'active' WHERE account_id = 1;

SELECT banking.transfer_funds(1, 4, 100);
-- Expected Error: Recipient account 4 is frozen

SELECT banking.transfer_funds(3, 2, 100);
-- Expected Error: Insufficient funds in account 3

SELECT banking.transfer_funds(1, 2, 200);
-- Expected: Succesfully

SELECT banking.transfer_funds(3, 2, 50);
-- Expected: Succesfully (account balance will be 0)

SELECT * FROM banking.accounts ORDER BY account_id;
SELECT * FROM banking.transactions ORDER BY transaction_date DESC;