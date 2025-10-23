const LoginModel = require ('./../models/LoginModel');
class HomeController {
    homeview(req,res) {
        res.render('home');
    }
    loginview(req,res) {
        let message = req.query.error;
        if ( message == 1) message = "Sai tài khoản hoặc mật khẩu!";
        else message='';
        res.render('index', {
            noti: message
        });
    }
    async checkLogin(req,res) {
        let account = req.body.account;
        let password = req.body.password;
        let x = await LoginModel.checkLogin(account,password);
        if (x) return res.json({ok:true});
        else return res.json({ok:false});
        
    }
    apiView(req,res) {
        res.render('scene');
    }
    signupView(req,res) {
        res.render('signup');
    }
    signupSucessView(req,res) {
        res.render('signup_success');
    }
    async signupAccount(req,res) {
        let name = req.body.full_name;
        let birthday = req.body.birthday;
        let phone_number = req.body.phone_number;
        let account = req.body.account;
        let password = req.body.password;
        let role = 'volunteer';
        try{
            let x = await LoginModel.addAccount(name, birthday, phone_number, account, password, role);
            if (x) return res.json({ok:true});
            else return res.json({ok:false, message: 'Không thể tạo tài khoản.'});
        }catch(err){
            console.error('signupAccount error', err);
            return res.status(500).json({ok:false, message: 'Lỗi server.'});
        }

    }
}
module.exports = new HomeController;