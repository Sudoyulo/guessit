-- drop table if exists
DROP TABLE IF EXISTS avatars CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS user_game CASCADE;
DROP TABLE IF EXISTS guesses CASCADE;

-- create tables
CREATE TABLE avatars (
  id SERIAL PRIMARY KEY NOT NULL,
  avatar_url VARCHAR(255)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  initials VARCHAR(255),
  avatar_id INTEGER REFERENCES avatars(id) ON DELETE CASCADE,
  date_started TIMESTAMP,
  player_id VARCHAR(255)
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY NOT NULL,
  solution VARCHAR(255)
);

CREATE TABLE user_game (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  turns_taken INTEGER,
  completed_on TIMESTAMP,
  started_on TIMESTAMP
);

CREATE TABLE guesses (
  id SERIAL PRIMARY KEY NOT NULL,
  user_game_id INTEGER REFERENCES user_game(id) ON DELETE CASCADE,
  row1Guess VARCHAR(255),
  row1Timestamp TIMESTAMP,
  row2Guess VARCHAR(255),
  row2Timestamp TIMESTAMP,
  row3Guess VARCHAR(255),
  row3Timestamp TIMESTAMP,
  row4Guess VARCHAR(255),
  row4Timestamp TIMESTAMP,
  row5Guess VARCHAR(255),
  row5Timestamp TIMESTAMP,
  row6Guess VARCHAR(255),
  row6Timestamp TIMESTAMP
);