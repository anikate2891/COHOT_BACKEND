
// export async function registerController(req, res, next) {
//     try {
//         throw new Error("Not implemented");
//     } catch (err) {
//         err.status = 400;
//         next(err);
//     }
// }   

export async function registerController(req, res, next) {
    res.status(201).json({message: "User registered successfully"});
}       