-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

ALTER TABLE movies ADD COLUMN image_path TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

ALTER TABLE movies DROP COLUMN image_path;
-- +goose StatementEnd
