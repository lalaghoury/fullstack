import React, { useEffect, useState } from 'react'
import '../BlogForm/BlogForm.scss'
import { Button, Flex, Form, Input, Modal, Select, Upload, message } from 'antd'
import { useAddRecipe } from '../../context/AddRecipeContext';
import { useFunctions } from '../../context/FunctionsSupply';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditBlog() {
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState(null);
    const { blog_id } = useParams();
    const [allCategories, setAllCategories] = useState([]);
    const navigate = useNavigate();

    const {
        onFinishBlog,
        uploadButton,
        beforeUpload,
        handleUpload,
        recipe_imageurl,
        showImage,
        setShowImage,
        form, setRecipe_imageurl } = useAddRecipe();
    const { getSingleBlog, getAllCategories } = useFunctions();

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getAllCategories();
            setAllCategories(categories);
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const blog = await getSingleBlog(blog_id);
                setBlog(blog);
                setRecipe_imageurl(blog.image);
                setShowImage(true)
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBlog();
    }, [blog_id]);
    if (blog === null) {
        return <h1>Loading...</h1>;
    } else if (!blog) {
        console.error('Blog not found');
        return <h1>Blog not found</h1>;
    }
    const updateBlog = async (values) => {
        try {
            const response = await axios.put(`http://localhost:5000/blog/${blog_id}`, { ...values, image: recipe_imageurl });
            if (response.data.success) {
                console.log(`Update Successfull`, response.data.updatedPost);
                message.success("Blog Updated Successfully", 2);
                navigate(-1)
            } else {
                console.log(`Error Updationg Blog`)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const deleteBlog = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/blog/${blog_id}`);
            if (response.data.success) {
                console.log(`Delete Successfull`, response.data.deletedPost);
                message.success("Blog Deleted Successfully", 2);
                setRecipe_imageurl('');
                setShowImage(false)
                navigate(-2)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleBlogDelete = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this blog?',
            content: 'Once deleted, the blog cannot be recovered.',
            onOk: () => {
                deleteBlog();
            },
        });
    }
    const { title, description, content, slogan } = blog;
    console.log(title)

    return (
        <div>
            <Form
                form={form}
                scrollToFirstError={true}
                initialValues={{
                    title, description, content, slogan,
                }}
                onFinish={updateBlog}
                layout="vertical"
                className="recipe-form"
                style={{
                    maxWidth: 700,
                }}
            >
                {/*Input For BLog Title */}
                <Form.Item
                    label="Blog Title:"
                    name="title"
                    className="recipe-title"
                    rules={[
                        { required: true, message: "Please input the Blog Title!" },
                    ]}
                >
                    <Input
                        placeholder="Enter Your Blog Name"
                        className="antd-form-input"
                    />
                </Form.Item>

                {/*Input For Recipe Image Upload */}
                <Form.Item label="BLog Image" name="image">
                    <Upload
                        beforeUpload={beforeUpload}
                        onChange={handleUpload}
                        showUploadList={false}
                    >
                        {uploadButton}
                    </Upload>
                    {showImage ? (
                        <div>
                            <img
                                src={recipe_imageurl}
                                alt="avatar"
                                style={{
                                    height: "100px",
                                    objectFit: "fill",
                                }}
                            />
                        </div>
                    ) : (
                        null
                    )}
                </Form.Item>

                {/*Input For Blog Slogan */}
                <Form.Item
                    label="Blog Slogan:"
                    name="slogan"
                    className="recipe-title"
                    rules={[
                        { required: true, message: "Please input the Blog Slogan!" },
                    ]}
                >
                    <Input
                        placeholder="Enter Your Blog Slogan"
                        className="antd-form-input"
                    />
                </Form.Item>

                {/* Input For Category */}
                <Form.Item
                    label="Category:"
                    name='category'
                    rules={[{ required: true, message: "Please select the category!" }]}
                    initialValue={blog.category?._id}
                >
                    <Select
                        placeholder="Select Category"
                        style={{ width: 200 }}
                        className="antd-form-input"
                    >
                        {allCategories.map((category) => (
                            <Select.Option key={category._id} value={category._id}>{category.categoryname}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                {/*Input For Blog Description */}
                <Form.Item
                    label="Blog Description:"
                    name="description"
                    rules={[
                        { required: true, message: "Please input the Blog Description!" },
                    ]}
                >
                    <Input.TextArea
                        showCount
                        maxLength={100}
                        placeholder="Introduce your Blog"
                        className="antd-form-input"
                    />
                </Form.Item>

                {/* Blog Content */}
                <Form.Item
                    label="Blog Content:"
                    name="content"
                    rules={[
                        { required: true, message: "Please input the Blog Content!" },
                    ]}
                >
                    <Input.TextArea
                        showCount
                        // maxLength={100}
                        placeholder="Introduce your Blog"
                        className="antd-form-input"
                    />
                </Form.Item>

                <Flex style={{ marginTop: "20px", justifyContent: "center", gap: "20px" }}>

                    {/* Update Button */}
                    <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                        <Button className="bg-primary text-white bold disable-hover" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>

                    {/* Delete Button */}
                    <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                        <Button onClick={() => handleBlogDelete()} className="bg-primary text-white bold disable-hover">
                            Delete
                        </Button>
                    </Form.Item>


                    {/* Cancel Button */}
                    <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                        <Button
                            className="bg-primary text-white bold disable-hover"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                    </Form.Item>

                </Flex>
            </Form>
        </div >
    )
}

export default EditBlog