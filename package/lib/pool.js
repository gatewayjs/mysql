const MYSQL = require('./mysql');
module.exports = class MySQL {
  constructor(clients) {
    this.$clients = clients;
    this.$used = {};
  }

  async get(name) {
    if (!this.$clients[name]) throw new Error('can not find the client of mysql by name ' + name);
    if (this.$used[name]) return this.$used[name];
    const pool = this.$clients[name];
    const connection = await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err);
        resolve(connection);
      });
    });
    const mysql = new MYSQL(connection);
    this.$used[name] = mysql;
    return mysql;
  }

  async resolve() {
    for (const i in this.$used) {
      const target = this.$used[i];
      await target.commit();
    }
  }

  async reject(e) {
    for (const i in this.$used) {
      const target = this.$used[i];
      await target.rollback();
    }
  }

  stop() {
    for (const i in this.$used) {
      const target = this.$used[i];
      target.release();
      delete this.$used[i];
    }
  }
}