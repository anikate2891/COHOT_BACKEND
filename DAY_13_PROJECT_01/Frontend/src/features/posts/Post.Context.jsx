import { createContext, useState} from "react";


export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [post, setPost] = useState(null);
    const [feed, setFeed] = useState([]);

    return (
        <PostContext.Provider value={{ post, setPost, feed, setFeed }}>
            {children}
        </PostContext.Provider>
    );
}