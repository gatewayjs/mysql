# @gatewayjs/mysql

MySQL plug-in for gateway.js

## Install

```bash
cli gw:setup @gatewayjs/mysql
```

## Usage

```javascript
const mysql = ctx.mysql.get('test');
await mysql.begin();
await mysql.query(sql, ...params);
await mysql.insert(table, data);
await mysql.update(table, data, where, ...wheres);
await mysql.delete(table, where, ...wheres);
```