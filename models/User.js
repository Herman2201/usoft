import client from '../db.js';
import ApiError from '../exceptions/api-error.js';

class User {
  constructor() {
    this.guest = false;
  }

  async findUserId(id) {
    const data = await client('users')
      .select('id', 'login', 'full_name', 'email', 'profile_pic', 'rating')
      .where('id', '=', id);
    if (data.length === 0) {
      throw ApiError.NotFound('user not found');
    }
    return data[0];
  }

  async getAllUsers() {
    const data = await client('users')
      .join('roles', 'users.id', '=', 'roles.user_id')
      .select(
        'users.id',
        'users.login',
        'users.full_name',
        'users.email',
        'users.profile_pic',
        'users.rating',
        'roles.role'
      );
    return data;
  }

  async saveUser({ login, password, email, role }) {
    try {
      await client.transaction(async (trx) => {
        await trx('users').insert({
          login: login,
          password,
          full_name: null,
          email: email,
          profile_pic: null,
          rating: null,
          active: true,
        });
        const id = await trx('users').select('id').where('login', '=', login);
        await trx('roles').insert({
          user_id: id[0].id,
          role: role || 'admin',
        });
      });
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        console.log(err);
        throw ApiError.ActiveEmail('You have already activated your email');
      }
    }
  }

  async saveToken(token, login) {
    try {
      await client('users').where('login', '=', login).update('token', token);
    } catch (err) {
      throw err;
    }
  }
  async isEqualLogin(login) {
    try {
      const data = await client('users')
        .select({
          name: 'login',
          email: 'email',
        })
        .where('login', '=', login);
      return data.length !== 0;
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        throw new Error(err.code + ': ' + err.message);
      }
    }
  }

  async isEqualEmail(email) {
    try {
      const data = await client('users')
        .select({
          email: 'email',
        })
        .where('email', '=', email);
      return data.length !== 0;
    } catch (err) {
      if (!err.toString().match(/ignore/)) {
        throw new Error(err.code + ': ' + err.message);
      }
    }
  }

  async initUser(columnName, value) {
    try {
      const data = await client('users')
        .join('roles', 'users.id', '=', 'roles.user_id')
        .select(
          'users.id',
          'users.login',
          'users.password',
          'users.full_name',
          'users.email',
          'users.profile_pic',
          'users.rating',
          'roles.role'
        )
        .where(columnName, '=', value);
      if (data.length === 0) {
        throw ApiError.UnknowUser('User does not exist');
      }
      return { ...data[0] };
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(id, nameColumn, value) {
    try {
      await client('users').where('id', '=', id).update(nameColumn, value);
    } catch (err) {
      throw err;
    }
  }

  async updateUserDate(id, date) {
    try {
      await client('users').where('id', '=', id).update({
        login: date.login,
        password: date.password,
        full_name: date.fullName,
        email: date.email,
        profile_pic: date.avatar,
      });
    } catch (err) {
      throw err;
    }
  }

  async dropUser(id) {
    try {
      await client('users').where('id', '=', id).del();
    } catch (err) {
      throw err;
    }
  }
  async logout(id) {
    try {
      await client('users').where('id', '=', id).update('token', null);
    } catch (err) {
      throw err;
    }
  }

  async getValue(id, search) {
    const data = await client('users').select(search).where('id', '=', id);
    return { ...data[0] };
  }

  isAdmin(role) {
    return role === 'admin';
  }
  isGuest() {
    return this.guest;
  }
}

export default new User();
