import dotenv from "dotenv";
dotenv.config();

export async function handleError(err, req, res, next) {
        const response = {message : err.message}

        if(process.env.NODE_ENV === "development") {
            response.stack = err.stack;
            // stack holo error er details, jekhane error ta kothay hoyeche, kon file e hoyeche, kon line e hoyeche, etc. development mode e amra stack o dekhabo, kintu production mode e amra stack dekhabo na.
    }
    res.status(err.status).json(response);
}

export default handleError;