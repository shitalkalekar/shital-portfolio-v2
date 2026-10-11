import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image to upload.",
            });
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "shital-portfolio",
                    resource_type: "image",
                },
                (error, uploadResult) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(uploadResult);
                }
            );

            uploadStream.end(req.file.buffer);
        });

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully.",
            data: {
                url: result.secure_url,
                publicId: result.public_id,
            },
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Image upload failed.",
        });
    }
};