import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Attachment, AttachmentInterface } from "../models/attachment";
import { User } from "../models/user";
import { connectedUsers } from "../state/connectedUsers";
import fs from "fs";

export const sendAttachment = async (req: Request, res: Response) => {
    const image: any = req.files.image;
    fs.writeFileSync(`${process.cwd()}/uploads/${image.name}`, image.data, {
        encoding: "binary"
    });

    const uploadedFile = await cloudinary.uploader.upload(
        `${process.cwd()}/uploads/${image.name}`
    );

    fs.unlinkSync(`${process.cwd()}/uploads/${image.name}`);

    const token: string = String(req.headers.token);
    const data: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId: string = String(data.userId);

    const attachmentFrom = await User.findById(userId);
    const attachmentTo = await User.findById(req.body.attachmentTo);

    const newAttachment = new Attachment({
        attachmentURL: uploadedFile.secure_url,
        attachmentFrom: attachmentFrom,
        attachmentTo: attachmentTo,
        createdOn: new Date(),
        publicId: uploadedFile.public_id,
        status: req.body.attachmentTo in connectedUsers ? "delivered" : "sent"
    });

    newAttachment.save();

    if (req.body.attachmentTo in connectedUsers) {
        connectedUsers[req.body.attachmentTo].emit(
            "receiveAttachment",
            newAttachment
        );
    }

    res.json(newAttachment);
};

export const deleteAttachment = async (req: Request, res: Response) => {
    const attachmentId = req.params.attachmentId;
    const attachment: AttachmentInterface = await Attachment.findById(
        attachmentId
    );

    const result = await cloudinary.uploader.destroy(attachment.publicId);

    await Attachment.deleteOne({ _id: attachmentId });

    if (String(attachment.attachmentTo._id) in connectedUsers) {
        connectedUsers[String(attachment.attachmentTo._id)].emit(
            "deleteAttachment",
            { attachmentId: attachmentId }
        );
    }

    res.json(result);
};
