exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "You are not logged in !" });
    }

    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res
        .status(401)
        .json("the User beloging to this token does no longer exist");
    }

    //check if user chenage password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return res
        .status(401)
        .json({ message: "Password is change please Login again" });
    }
    res.locals.user = freshUser;
    req.user = freshUser;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "not Authorized", error: error.message });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "you do not have permission to perform this action",
      });
    }

    next();
  };
};
