import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/userContext";
import Loading from "../components/Loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DeletePost = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [id]);

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) {
          navigate(0);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error.response);
    }
    setIsLoading(false);
  };

  if (isLoading) return <Loading/>;

  return (
    <Link className="btn sm danger" onClick={removePost}>
      Delete
    </Link>
  );
};

export default DeletePost;
