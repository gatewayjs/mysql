module.exports = class MySQL {
  constructor(connection) {
    this.connection = connection;
  }

  begin() {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction(err => {
        if (err) return reject(err);
        this.__BEGINED__ = true;
        resolve();
      })
    })
  }

  commit() {
    if (!this.__BEGINED__) return;
    return new Promise((resolve, reject) => {
      this.connection.commit(err => {
        if (err) return reject(err);
        delete this.__BEGINED__;
        resolve();
      })
    })
  }

  rollback() {
    if (!this.__BEGINED__) return;
    return new Promise((resolve, reject) => {
      this.connection.rollback(err => {
        if (err) return reject(err);
        delete this.__BEGINED__;
        resolve();
      })
    })
  }

  release() {
    this.connection.release();
  }

  query(sql, ...args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    })
  }

  insert(table, data) {
    return this.query(`INSERT INTO ?? SET ?`, table, data);
  }

  update(table, data, where, ...wheres) {
    let fields = [], values = [table];
    for (const key in data){
      fields.push('??=?');
      values.push(key, data[key]);
    }
    let sql = `UPDATE ?? SET ${fields.join(',')}`;
    if (typeof where === 'object') {
      const whereFields = [], whereValues = [];
      for (const j in where) {
        whereFields.push('??=?');
        whereValues.push(j, where[j]);
      }
      if (whereFields.length) {
        sql += ` WHERE ${whereFields.join(' AND ')}`;
        values.push(...whereValues);
      }
    } else {
      if (where) {
        sql += ' ' + where;
        values.push(...wheres);
      }
    }
    return this.query(sql, ...values);
  }

  delete(table, where, ...wheres) {
    let fields = [], values = [table];
    let sql = `DELETE FROM ??`;
    if (typeof where === 'object') {
      const whereFields = [], whereValues = [];
      for (const j in where) {
        whereFields.push('??=?');
        whereValues.push(j, where[j]);
      }
      if (whereFields.length) {
        sql += ` WHERE ${whereFields.join(' AND ')}`;
        values.push(...whereValues);
      }
    } else {
      if (where) {
        sql += ' ' + where;
        values.push(...wheres);
      }
    }
    return this.query(sql, ...values);
  }
}