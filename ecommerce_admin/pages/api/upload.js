import multiparty from "multiparty";
import { S3Client } from "@aws-sdk/client-s3";

export default async function handle(req, res) {
  //we will parse the file outselves
  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  console.log("length:", files.file.length);
  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  });

  return res.json("ok");
}

export const config = {
  api: {
    bodyParser: false,
  },
};
