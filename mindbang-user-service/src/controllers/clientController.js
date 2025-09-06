// src/controllers/clientController.js
const Client = require('../models/Client');

exports.createClient = async (req, res, next) => {
  try {
    const client = new Client(req.body);
    const saved = await client.save();
    res.status(201).json({ success: true, client: saved });
  } catch (error) {
    next(error);
  }
};

exports.getClients = async (req, res, next) => {
  try {
    const clients = await Client.find();
    res.status(200).json({ success: true, clients });
  } catch (error) {
    next(error);
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    res.status(200).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, client: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Cliente eliminado' });
  } catch (error) {
    next(error);
  }
};
