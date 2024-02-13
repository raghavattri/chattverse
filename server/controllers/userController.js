const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next)=>{
  try 
  {
    const { username, password } = req.body; 
    const user = await User.findOne({ username }); 

    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false }); 

    const isPasswordValid = await bcrypt.compare(password, user.password); 

    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false }); 

    delete user.password; // Removing the password field from the user object before sending it in the response as it wont affect user object as we are not saving it 
    return res.json({ status: true, user }); 
  }
  catch (ex) 
  {
    next(ex); // If an error occurs during authentication, pass it to the error handling middleware
  }
};
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const emailCheck = await User.findOne({ email });

    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });

    onlineUsers.delete(req.params.id);
    
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
