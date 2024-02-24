import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import Comments from "./Comments";
import TextArea from "antd/es/input/TextArea";
import { useAuth } from "../../context/AuthContext";

const CommentsSection = ({ Id, used }) => {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentBody, setCommentBody] = useState("");
    const { auth } = useAuth()
    const userId = auth.user._id;

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/comments/${Id}`
            );
            setComments(response.data.reverse());
        } catch (error) {
            console.error("Fetching data failed:", error); // Debug: log the error if fetching fails
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Fetch data once when component mounts

    const onUpdateComments = () => {
        fetchData(); // Call fetchData to update comments
    };

    const handleAdd = () => {
        const newComment = {
            content: commentBody,
            author: userId,
            relatedTo: Id, // assuming the Id is already a mongoose.Schema.Types.ObjectId
            onModel: used,
            model: used,
        };
        axios
            .post("http://localhost:5000/comments", newComment)
            .then((response) => {
                setCommentBody(""); // Clear input after successful addition
                onUpdateComments(); // Fetch data again to update comments
            })
            .catch((error) => {
                console.log(error);
            });
    };

    if (loading) return <div>Loading...</div>;

    if (!comments) return <div>No comments found</div>;

    return (
        <div>
            <h1>Leave a Comment</h1>
            <div className="comment-container">
                <TextArea
                    type="text"
                    placeholder="Add a comment"
                    className="input"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    onPressEnter={handleAdd}
                    style={{ marginBottom: 10 }}
                    allowClear
                    autoSize={{ minRows: 0, maxRows: 100 }}
                />
                <Button className="button" onClick={handleAdd}>
                    Add
                </Button>
            </div>
            <div>
                {comments?.map((comment) => (
                    <Comments
                        key={comment._id}
                        comments={comment}
                        onUpdateComments={onUpdateComments}
                        used={used}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;

