if (process.env.PRODUCTION !== 'true') {
    var configVariables = require('./configVariables');
} 

module.exports = {
    DBURI: process.env.DBURI || configVariables.db.DBURI,
    PORT: process.env.PORT || 3000
};
