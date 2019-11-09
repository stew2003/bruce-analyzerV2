const Joi = require('@hapi/joi')

const keyword = Joi.object()
  .keys({
    keyword: Joi.string().trim().min(1).required()
  })
  .required()

module.exports = {
  keyword
}
