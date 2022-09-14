import knex from 'knex';

const client = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'hermanuskalo',
    password: 'ipanda123',
    database: 'usof_backend',
  },
  searchPath: ['knex', 'public'],
});

export default client;
