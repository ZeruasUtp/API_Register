const Evento = require('./eventModel');
const RegistroEv = require('./registroEvModel');
const User = require('./userModel');

Evento.hasMany(RegistroEv, { foreignKey: 'evento_id' });
RegistroEv.belongsTo(Evento, { foreignKey: 'evento_id' });

RegistroEv.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = { Evento, RegistroEv, User };
