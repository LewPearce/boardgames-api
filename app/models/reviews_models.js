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

module.exports = { fetchReviews };
