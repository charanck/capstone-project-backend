"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const connectToCloudinary = (req, res, next) => {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    next();
};
exports.connectToCloudinary = connectToCloudinary;
//# sourceMappingURL=connectToCloudinary.js.map