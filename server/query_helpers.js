const { Pool } = require("pg");
const dbParams = require("./lib/db");
const pool = new Pool(dbParams);


const getUsers = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

//user, avatar, user_game, game, (guesses, followers)
const getUser = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * , user_game.id AS ugid FROM users INNER JOIN avatars ON users.avatar_id = avatars.id INNER JOIN user_game ON users.id = user_game.user_id INNER JOIN games ON user_game.game_id = games.id WHERE users.id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getGames = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM games', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const getGame = (id) => {

  if (id === 0) {
    return pool.query('SELECT * FROM games ORDER BY id desc LIMIT 1')
      .then(results => {
        return results.rows[0];
      })
  }

  return pool.query('SELECT * FROM games WHERE id = $1', [id])
    .then(results => {
      return results.rows[0];
    })

}

const makeGame = (word) => {

  return pool.query('INSERT INTO games (solution) VALUES ($1);', [word])
    .then(results => {
      return results;
    })

}


const getAvatars = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM avatars', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  })
}

const setAvatar = (uid, aid) => {

  return pool.query('UPDATE users SET avatar_id = $1 WHERE id = $2;', [aid, uid])
    .then(results => {
      return results;
    })

}

const setInitials = (uid, key) => {
  return pool.query("UPDATE users SET initials = $1 WHERE id = $2;", [key, uid])
    .then(results => {
      return results;
    })
}

const createUserGame = (uid, gid, guess) => {

  pool.query("INSERT INTO user_game (user_id, game_id, started_on) VALUES ($1,$2, NOW());", [uid, gid])
    .then(results => {
      return results;
    })

  console.log("query 1 complete")

  pool.query("SELECT id FROM user_game ORDER BY id desc LIMIT 1")
    .then(results => {

      console.log("please show", results.rows[0].id)
      //create guesses with guess and result

      pool.query("INSERT INTO guesses (user_game_id, row1Guess, row1Timestamp) VALUES ($1, $2, NOW())", [results.rows[0].id + 1, guess])
        .then(results => {
          return results;
        })

    })
  return results;

}


const getUserStats = (uid, gid) => {
  return pool.query("select * from user_game where user_id = $1 AND game_id = $2", [uid, gid])
    .then(results => {
      return results;
    })
}

const saveGuess = (id, row, guess) => {

  return pool.query("UPDATE guesses SET row" + row + "guess = $1, row" + row + "timestamp = NOW() WHERE user_game_id = $2;", [guess, id])
    .then(results => {
      return results;
    })

}

const saveNewGuess = (ugid, guess) => {
  console.log("saving new", ugid, guess)

  return pool.query("INSERT INTO guesses (user_game_id, row1Guess, row1Timestamp) VALUES ($1, $2, NOW())", [ugid, guess])
    .then(results => {
      return results;
    })

}


module.exports = {
  getUsers,
  getUser,
  getGames,
  getGame,
  makeGame,
  getAvatars,
  setAvatar,
  setInitials,
  createUserGame,
  getUserStats,
  saveGuess,
  saveNewGuess
}