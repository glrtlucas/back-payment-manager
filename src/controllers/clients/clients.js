const knex = require("../../database/db");
const clientRegistrationSchema = require("../../validations/clientRegistrationSchema");

const clientRegistration = async (req, res) => {
  const { name, email, cpf, state,
    phone, zipcode, street, district,
    city, additional, landmark,
  } = req.body;
  const { id } = req.userData;

  try {
    await clientRegistrationSchema.validate(req.body);

    const clientEmailExists = await knex("clients").where("email", email).first();
    if (clientEmailExists) return res.status(404).json("E-mail já cadastrado.");

    const clientCPFExists = await knex("clients").where("cpf", cpf).first();
    if (clientCPFExists) return res.status(404).json("CPF já cadastrado.");

    const newClient = await knex("clients")
      .insert({ user_id: id, name, email, cpf,
        phone, zipcode, street, state,
        district, city, additional, landmark
      }).returning("*");

    if (!newClient) return res.status(400).json('Erro ao cadastrar cliente.');

    return res.status(200).json(newClient);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  clientRegistration,
};
