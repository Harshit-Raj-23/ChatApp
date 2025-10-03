import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { options } from "../constants.js";

// generating Access and Refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false,
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token."
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        throw new ApiError(400, "All credentials required.");
    }
    if (password !== confirmPassword) {
        throw new ApiError(400, "Password do not match");
    }

    const user = await User.findOne({
        username,
    });

    if (user) {
        throw new ApiError(409, "Username already exists! Try again.");
    }

    const maleProfileImage = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfileImage = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    await User.create({
        fullName,
        username,
        password,
        profileImage: gender === "male" ? maleProfileImage : femaleProfileImage,
        gender,
    });

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "Account created successfully"
            )
        );
});

export { registerUser };
