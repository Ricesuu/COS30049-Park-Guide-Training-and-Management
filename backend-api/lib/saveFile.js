// ✅ lib/saveFile.js
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Save a file buffer to the local uploads folder.
 * Filename is uuid-timestamp-originalName.
 * @param {Buffer} buffer
 * @param {string} originalName
 * @returns {string} relative path to store in DB
 */
export async function saveFile(buffer, originalName) {
  const filename = `${uuidv4()}-${Date.now()}-${originalName}`;
  const uploadDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadDir, filename);

  await fs.promises.mkdir(uploadDir, { recursive: true });
  await fs.promises.writeFile(filePath, buffer);

  return `/uploads/${filename}`; // relative path

  // ----------------------------------------------
  // 🔁 For future use with AWS S3:
  // import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
  // const s3 = new S3Client({ region: "your-region" });
  // await s3.send(
  //   new PutObjectCommand({
  //     Bucket: "your-bucket-name",
  //     Key: `receipts/${filename}`,
  //     Body: buffer,
  //     ContentType: "image/jpeg",
  //     ACL: "public-read" // or private
  //   })
  // );
  // return `https://your-bucket-name.s3.amazonaws.com/receipts/${filename}`;
  // ----------------------------------------------
}
