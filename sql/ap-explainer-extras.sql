-- Extra demo data for the "How SQL joins work" explainer.
-- Run it against the class AP database after create_ap.sql. It's safe to run more than once.
--
-- It adds one row to ContactUpdates for VendorID 28. No vendor has ID 28, and ContactUpdates
-- has no foreign key to Vendors, so this contact update matches no vendor. That gives the
-- RIGHT JOIN and FULL OUTER JOIN examples an unmatched row on the right-hand side, which the
-- original AP data can't show (its foreign keys stop any invoice pointing at a missing vendor).
USE AP
GO

IF NOT EXISTS (SELECT 1 FROM ContactUpdates WHERE VendorID = 28)
BEGIN
    SET IDENTITY_INSERT ContactUpdates ON
    INSERT ContactUpdates (VendorID, LastName, FirstName) VALUES (28, 'Whitfield', 'Nora')
    SET IDENTITY_INSERT ContactUpdates OFF
END
GO
