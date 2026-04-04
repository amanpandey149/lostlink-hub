// In-memory storage for the MVP
// In a real app, this would be a database (MongoDB/Postgres/Firebase)

const store = {
    lostItems: [],
    foundItems: [],
};

module.exports = store;
