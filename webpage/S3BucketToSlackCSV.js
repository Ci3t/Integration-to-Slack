const axios = require("axios");
const AWS = require("aws-sdk");
const fs = require("fs");
const { promisify } = require("util");

//!make an s3 instance

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ONBOARDING_BUCKET_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_ONBOARDING_BUCKET_SECRET_KEY,
});

//!uploadToS3
const uploadToS3 = async (fileName, filePath, bucketName) => {
  const fileStream = fs.createReadStream(filePath);

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
    ACL: "public-read",
  };

  const { Location } = await s3.upload(params).promise();

  return Location;
};
//! Send the Message to Slack
const sendToSlack = async (webhookUrl, message) => {
  try {
    await axios.post(webhookUrl, {
      attachments: [
        {
          color: "#36a64f", // Set the color to a green shade using a hex code
          text: message,
        },
      ],
    });
    console.log(`Message sent to Slack: ${message}`);
  } catch (err) {
    console.error(`Error sending message to Slack: ${err}`);
  }
};

const uploadToS3AndSendToSlack = async (
  fileName,
  filePath,
  bucketName,
  webhookUrl,
  username,
) => {
  try {
    const location = await uploadToS3(fileName, filePath, bucketName);
    const message = `User *${username}* Completed onBoarding CSV file is now available at: ${location}`;

    await sendToSlack(webhookUrl, message);

    console.log(`File uploaded to S3 and message sent to Slack: ${message}`);
  } catch (err) {
    console.error(`Error uploading to S3 and sending to Slack: ${err}`);
  }
};

//!route function that make csv file

router.post("/update/summary", async (req, res, next) => {
  const { user } = req;

  const csvFromObject = (arr) => {
    const array = [Object.keys(arr[0])].concat(arr);

    return array
      .map((it) => {
        console.log(it);
        if (Array.isArray(it.value)) {
          it.value = it.value.toString().replaceAll(",", ";");
          console.log(it.value);
        }
        return Object.values(it).toString();
      })
      .join("\n");
  };

  try {
    //?make csv from req body
    const csv = csvFromObject(req.body);

    mailUtils.sendUserSettingSummary(user, csv);

    // Write the CSV data to a file
    const fileName = `${user.name.replaceAll(" ", "_")}-${user.id}.csv`;
    const filePath = `${__dirname}/${fileName}.csv`;
    await promisify(fs.writeFile)(filePath, csv);

    // Upload the file to S3 and send the location to Slack
    // const bucketName = "user-onboarding-csv";
    const bucketName = process.env.AWS_S3_SLACK_BUCKET_NAME;
    const webhookUrl = process.env.SLACK_WEBHOOK;
    await uploadToS3AndSendToSlack(
      fileName,
      filePath,
      bucketName,
      webhookUrl,
      user.name,
    );

    // Delete the file from the local filesystem
    await promisify(fs.unlink)(filePath);

    return res.send({ status: "ok" });
  } catch (err) {
    console.log(err);
    return res.send({ status: "error", message: "Error sending email" });
  }
});
