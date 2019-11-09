CREATE TABLE Albums (
  aid INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255),
  year SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (aid),
  FULLTEXT (title)
) ENGINE=InnoDB;

CREATE TABLE Songs (
  sid INT UNSIGNED NOT NULL AUTO_INCREMENT,
  aid INT UNSIGNED NOT NULL,
  title VARCHAR(255),
  normalizedLyrics TEXT,
  lyrics TEXT,
  PRIMARY KEY (sid),
  FOREIGN KEY (aid) REFERENCES Albums(aid),
  FULLTEXT (normalizedLyrics),
  FULLTEXT (title)
) ENGINE=InnoDB;
