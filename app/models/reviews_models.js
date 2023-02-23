const db = require("../../db/connection");

const fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.owner,
            reviews.title,
            reviews.review_id,
            reviews.category,
            reviews.review_img_url,
            reviews.created_at,
            reviews.designer,
            reviews.votes, 
            COUNT(comments.review_id)::INT as comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchReviewByID = (req) => {
  let { params } = req;
  return db
    .query(
      `SELECT * FROM reviews
  WHERE review_id = $1`,
      [params.review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Oops! ID:${params.review_id} doesn't exist!`,
        });
      } else {
        return rows[0];
      }
    });
};

const addComment = (req) => {
  const { review_id } = req.params;
  const { username } = req.body;
  const { body } = req.body;
  return db
    .query(
      `INSERT INTO comments (author, body, review_id)
  VALUES($1, $2, $3)
  RETURNING *;
  `,
      [username, body, review_id]
    )
    .then((comment) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `Oops! that user doesn't exist!`,
        });
      } else if (comment.rows[0].body === "") {
        return Promise.reject({
          status: 400,
          msg: `failed to submit empty comment`,
        });
      } else {
        return comment.rows[0];
      }
    });
};

const fetchCommentsByReview = (req) => {
  let { params } = req;
  return db
    .query(
      `SELECT * FROM comments
            WHERE review_id = $1
			ORDER BY created_at DESC`,
      [params.review_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = {
  fetchReviews,
  fetchReviewByID,
  addComment,
  fetchCommentsByReview,
};
