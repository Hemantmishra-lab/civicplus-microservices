-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(150) NOT NULL UNIQUE,
    active       BOOLEAN      NOT NULL DEFAULT TRUE,
    subscribed_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);
