const { User } = require("../models");
const bcrypt = require("bcrypt");

const userController = {
  // Crear un nuevo usuario (SOLO administrador puede hacerlo)
  async createUser(req, res) {
    const { name, email, password, role } = req.body;

    try {
      // Validar que el usuario autenticado es administrador
      if (!req.user || req.user.role !== "administrador") {
        return res.status(403).json({ error: "Solo el administrador puede crear usuarios con este método" });
      }

      // Validar que el rol enviado sea válido (estudiante, docente o administrador)
      const validRoles = ["estudiante", "docente", "administrador"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Rol inválido. Solo se permiten 'estudiante', 'docente' o 'administrador'" });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obtener todos los usuarios
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un usuario por ID
  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un usuario
  async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Si se envía contraseña, se vuelve a hashear
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      user.name = name || user.name;
      user.email = email || user.email;

      // Solo el administrador puede cambiar roles
      if (role) {
        if (!req.user || req.user.role !== "administrador") {
          return res.status(403).json({ error: "Solo el administrador puede modificar el rol de un usuario" });
        }

        const validRoles = ["estudiante", "docente", "administrador"];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ error: "Rol inválido" });
        }

        user.role = role;
      }

      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Eliminar un usuario
  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      await user.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;
