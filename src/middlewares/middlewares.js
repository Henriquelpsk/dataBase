exports.meuMiddleware = (req,res,next) => {
	res.locals.umaVariavelLocal = 'Este é o valor'
	next();
};
exports.checkCsrfError = (err, req, res ,next) => {
	if(err && 'EBADCSRFTOKEN' === err.code) {
		return res.render('404');
	}
};

exports.csrfMiddleware = (req, res, next) => {
	res.locals.csrfToken = req.csrfToken();
	next();
};