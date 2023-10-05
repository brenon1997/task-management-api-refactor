const jwt = require('jsonwebtoken')
const path = require('path');
const dbPath = path.resolve(__dirname, '../../config/db');
require(dbPath);
const dotenv = require('dotenv');
dotenv.config();

module.exports = () => {
  const authenticationJWT = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader)
      return res.status('401').send({ error: 'Token não informado' })

    const parts = authHeader.split(' ')

    if (!parts.length === 2)
      return res.status('401').send({ error: 'Erro no token' })

    const [bearer, token] = parts

    if (!/^Bearer$/i.test(bearer))
      return res.status('401').send({ error: 'Token malformatado' })

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err)
        return res.status('401').send({ error: 'Token inválido' })

      req.userId = decoded.id

      return next()
    })
  }

  return { authenticationJWT }
}