if (process.env.PRODUCTION !== 'true') {
    var configVariables = require('./configVariables');
} 

module.exports = {
    DBURI: process.env.DBURI || configVariables.db.DBURI,
    SECRET: process.env.SECRET || configVariables.session.SECRET,
    PORT: process.env.PORT || 3000
};
