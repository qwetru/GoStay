const user = require('../models/user');


module.exports.regForm = (req, res) => {
    res.render('user/register');
}

module.exports.regUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const nuser = new user({ email, username });
        const regUser = await user.register(nuser, password);
        req.login(regUser, err => {
            if (err) return next(err);
        });
        req.flash('success', 'REGISTERED!!!');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
        console.log(e);
    }
    res.redirect('/hotels');

}


module.exports.loginForm = (req, res) => {
    res.render('user/login');
}


module.exports.loginUser = (req, res) => {
    const redirectTo = req.session.returnTo || "/hotels";
    delete req.session.returnTo;
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectTo);
}


module.exports.logoutUser = (req, res) => {
    req.logOut();
    res.redirect('/login');
}
