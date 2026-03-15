function checkLogin(req, res, next) {
    const user = req.headers['user'];

    if (!user) {
        return res.status(401).send({
            message: "Chưa đăng nhập"
        });
    }

    req.user = JSON.parse(user);

    next();
}

module.exports = { checkLogin };