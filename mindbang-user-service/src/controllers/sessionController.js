// src/controllers/sessionController.js
const Session = require('../models/Session');

exports.registerSession = async (req, res, next) => {
  try {
    const { userId, clientId, ipAddress, userAgent, app } = req.body;

    const session = new Session({
      userId,
      clientId,
      ipAddress,
      userAgent,
      app
    });

    await session.save();
    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

exports.endSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Sesión no encontrada' });

    session.endedAt = new Date();
    session.active = false;
    await session.save();

    res.status(200).json({ success: true, message: 'Sesión finalizada', session });
  } catch (error) {
    next(error);
  }
};

exports.getActiveSessions = async (req, res, next) => {
  try {
    const { client, ip, app, from, to, page = 1, limit = 20 } = req.query;

    const query = { active: true };

    if (client) query.client = client;
    if (ip) query.ip = ip;
    if (app) query.app = app;
    if (from || to) {
      query.startedAt = {};
      if (from) query.startedAt.$gte = new Date(from);
      if (to) query.startedAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      Session.find(query).sort({ startedAt: -1 }).skip(skip).limit(parseInt(limit)),
      Session.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sessions
    });
  } catch (error) {
    next(error);
  }
};
