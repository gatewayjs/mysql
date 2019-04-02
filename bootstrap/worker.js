const MySQL = require('mysql');
const Pool = require('../package/lib/pool');
module.exports = async $plugin => {
  const app = $plugin.$app;
  const connections = {};
  for (const name in $plugin.$config) {
    connections[name] = MySQL.createPool($plugin.$config[name]);
  }

  app.on('start', async ctx => {
    const mysql = new Pool(connections);
    ctx.on('resolve', () => mysql.resolve());
    ctx.on('reject', e => mysql.reject(e));
    ctx.on('stop', () => mysql.stop());
    Object.defineProperty(ctx, 'mysql', { value: mysql });
  });

  app.on('destroyed', async () => {
    for (const i in connections) {
      const connection = connections[i];
      await new Promise((resolve, reject) => {
        connection.end(err => {
          if (err) return reject(err);
          resolve();
        })
      })
    }
  })
}