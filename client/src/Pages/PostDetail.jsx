import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import DeletePost from "./DeletePost";
import Loader from "../components/Loading";
import { UserContext } from "../Context/userContext";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setPost(response?.data);
      } catch (error) {
        setError(error.response.data.message);
      }
      setIsLoading(false);
    };
    getPost();
  }, [IdleDeadline]);

  if (isLoading) return <Loader />;

  return (
    <section className="post__detail">
      {error && <p>{error}</p>}
      {post && (
        <div className="container post__detail-container">
          <div className="post__detail-header">
            <PostAuthor authorId={post.creator} createdAt={post.createdAt} />
            {currentUser?.id == post?.creator && (
              <div className="post__detail-buttons">
                <Link
                  to={`/posts/${post?._id}/edit`}
                  className="btn sm primary"
                >
                  Edit
                </Link>
                <DeletePost id={post?._id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post_detail__thumbnail">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
              alt=""
            />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
