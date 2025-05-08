-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

CREATE TABLE IF NOT EXISTS movie_urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    url_type TEXT,  -- optional: can specify 'trailer', 'official_site', etc.
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

DROP TABLE IF EXISTS movie_urls;
-- +goose StatementEnd
