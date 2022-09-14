import client from '../db.js';
import Category from '../models/Category.js';
import ApiError from '../exceptions/api-error.js';
import isEqual from 'lodash/isEqual.js';

class Post {
  async getAllPosts() {
    return await client('posts').select('*');
  }

  async findPostId(id) {
    const post = await client('posts').select('*').where('id', '=', id);
    if (post.length === 0) {
      throw ApiError.NotFound('Post not found');
    }
    return post[0];
  }

  async getCategoriesPost(id) {
    const category = await client
      .select('id_category')
      .from('posts')
      .join('post_category', 'posts.id', 'post_category.id_post')
      .where('posts.id', '=', id);
    const categories = category.map((item) =>
      Category.findCategoryId(item['id_category'])
    );

    return await Promise.all(categories);
  }

  async isEqualTitlePost(title) {
    const isEmpty = await client('posts')
      .select('title')
      .where('title', '=', title);
    if (isEmpty.length !== 0) {
      throw ApiError.BadRequest('A post with that name already exists');
    }
  }

  async createPost(data) {
    try {
      const publishDate = new Date();
      await client('posts').insert({
        author_id: data.id,
        title: data.title,
        publish_date: publishDate,
        status: true,
        content: data.content,
        content_picture: data.picture || null,
      });
      const id = await client('posts')
        .select('id')
        .where('title', '=', data.title);
      return id[0];
    } catch (err) {
      throw err;
    }
  }
  async addCategoryPost(id_post, id_category) {
    Object.entries(id_category).forEach(async ([, value]) => {
      await client('post_category').insert({
        id_post,
        id_category: value,
      });
    });
  }
  async updateCategoryPost(id_post, id_category) {
    try {
      const oldCategory = await this.getCategoriesPost(id_post);
      const idOldCategory = oldCategory.map(({ id }) => id);

      const lengthUpdate = Object.keys(id_category).length;

      const idNewCategory = Object.values(id_category);

      if (isEqual(idNewCategory, idOldCategory)) {
        return;
      }
      const lengthOldCategory = oldCategory.length;

      if (lengthUpdate > lengthOldCategory) {
        const addCategory = idNewCategory.filter(
          (item) => !idOldCategory.includes(item)
        );
        addCategory.forEach(
          async (item) =>
            await client('post_category').insert({
              id_post,
              id_category: item,
            })
        );
      } else if (lengthUpdate < lengthOldCategory) {
        const delCategory = idOldCategory.filter(
          (item) => !idNewCategory.includes(item)
        );
        delCategory.forEach(
          async (item) =>
            await client('post_category')
              .where('id_post', '=', id_post)
              .andWhere('id_category', '=', item)
              .del()
        );
      } else {
        const category = idNewCategory.filter(
          (item) => !idOldCategory.includes(item)
        );
        const updateCategory = idOldCategory.filter(
          (item) => !idNewCategory.includes(item)
        );
        await client('post_category')
          .where('id_post', '=', id_post)
          .andWhere('id_category', '=', updateCategory[0])
          .update({
            id_category: category[0],
          });
      }
    } catch (err) {
      throw err;
    }
  }
  async updatePost(data) {
    try {
      await client('posts').where('id', '=', data.id).update({
        title: data.title,
        content: data.content,
      });
    } catch (err) {
      throw err;
    }
  }
  async deletePost(idPost) {
    try {
      await client('posts').where('id', '=', idPost).del();
    } catch (err) {
      throw err;
    }
  }
}

export default new Post();
