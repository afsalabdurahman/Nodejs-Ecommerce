const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
let User_schema=require('../model/userModel')
// In-memory user store

exports.userprofile={
  user:false
}







passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
   
    done(null, done);
});


const GOOGLE_CLIENT_ID = '926246450984-ng37e2qctm15gf5pefk2s5cf0h9r7oc4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, done) {
     
  
     console.log(profile._json.email)
                       ExistUser = await User_schema.findOne({email:profile._json.email}) 
                      
                    if(ExistUser){
                      return done("userExist")
                      user=true
                    }else{
                      const Userschema= new User_schema({
                        name: profile._json.name,
                        email: profile._json.email,
                        mobile: profile._json.phoneNo,
                        password:123456,
                        image:'',
                        isAdmin: 0,
                        is_blocked: 1,
                      });
                      const dbUserdata= await Userschema.save();
                    
                      console.log(profile._json,"11")
      return done(null,userProfile);
                    }                                                                        
      
  }
));
