function checkAdmin(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).send({
            message: "Không có quyền"
        });
    }
    next();
}

function checkModOrAdmin(req, res, next) {
    if (req.user.role !== "admin" && req.user.role !== "mod") {
        return res.status(403).send({
            message: "Không có quyền"
        });
    }
    next();
}

module.exports = { checkAdmin, checkModOrAdmin };