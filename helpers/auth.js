module.exports = {
	eunsureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error_msg", "Not authorised");
		res.redirect("/admin/login");
	}
}