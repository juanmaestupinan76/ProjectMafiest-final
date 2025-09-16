const Contact = require("../models/Contact");

const contactController = {
  // Crear un contacto
  async createContact(req, res) {
    try {
      const { name, email, message } = req.body;
      const newContact = await Contact.create({ name, email, message });
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el contacto" });
    }
  },

  // Obtener todos los contactos
  async getContacts(req, res) {
    try {
      const contacts = await Contact.findAll();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los contactos" });
    }
  },

  // Obtener un contacto por ID
  async getContactById(req, res) {
    try {
      const { id } = req.params;
      const contact = await Contact.findByPk(id);
      if (!contact) {
        return res.status(404).json({ error: "Contacto no encontrado" });
      }
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el contacto" });
    }
  },

  // Actualizar un contacto
  async updateContact(req, res) {
    try {
      const { id } = req.params;
      const { name, email, message } = req.body;
      const contact = await Contact.findByPk(id);
      
      if (!contact) {
        return res.status(404).json({ error: "Contacto no encontrado" });
      }
      
      await contact.update({ name, email, message });
      res.status(200).json(contact);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el contacto" });
    }
  },

  // Eliminar un contacto
  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const contact = await Contact.findByPk(id);
      
      if (!contact) {
        return res.status(404).json({ error: "Contacto no encontrado" });
      }
      
      await contact.destroy();
      res.status(200).json({ message: "Contacto eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el contacto" });
    }
  }
};

module.exports = contactController;
