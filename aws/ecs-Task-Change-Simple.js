//this file will send Simple message to slack on STOPPED or RUNNING new TASK
//! you need to provider ENV for hookUrl = Hook link and slackChannel = slack Channel Name
const url = require("url");
const https = require("https");

const postMessage = function (message, callback) {
  const body = JSON.stringify(message);
  const options = url.parse(process.env["hookUrl"]);

  options.method = "POST";
  options.headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  };

  const postReq = https.request(options, function (res) {
    let chunks = [];
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      return chunks.push(chunk);
    });
    res.on("end", function () {
      let body = chunks.join("");
      if (callback) {
        callback({
          body: body,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
        });
      }
    });
    return res;
  });
  postReq.write(body);
  postReq.end();
};

exports.handler = function (event, context) {
  console.info("start");
  console.log("event", JSON.stringify(event, null, 2));

  // default status
  let icon = ":mega:";
  let serviceName = event.detail.clusterArn.split("/").pop();
  // "ECS Task";
  let statusColor = "good";

  // set state color
  switch (event.detail["lastStatus"]) {
    case "RUNNING":
      statusColor = "good";
      break;
    case "STOPPED":
      statusColor = "danger";
      break;
    default:
      break;
  }

  //set post message
  const slackMessage = {
    channel: process.env["slackChannel"],
    attachments: [
      {
        color: statusColor,
        text: icon + " *" + serviceName + "*" + "\n",
        fields: [
          {
            title: "Date Time",
            value: event.time
              .toString()
              .replace("-", "/")
              .replace("T", " ")
              .replace("Z", " "),
            short: "true",
          },
          {
            title: "Task Definition Family (Task ID)",
            value: event.detail.taskArn.split("/").pop(),
            short: "true",
          },
          {
            title: "Cluster Name",
            value: event.detail.clusterArn.split("/").pop(),
            short: "true",
          },
          {
            title: "Service",
            value: event.detail.group.split(":").pop(),
            short: true,
          },

          {
            title: "Last Status",
            value: event.detail.lastStatus,
            short: "true",
          },
          {
            title: "Current Status",
            value: event.detail.desiredStatus,
            short: "true",
          },
          {
            title: "Started By",
            value: event.detail.startedBy,
            short: true,
          },
          {
            title: "Link to Task",
            value: `https://${
              event.region
            }.console.aws.amazon.com/ecs/home?region=${
              event.region
            }#/clusters/${event.detail.clusterArn
              .split("/")
              .pop()}/services/${event.detail.group.split(":").pop()}/tasks`,
            short: false,
          },
        ],
      },
    ],
  };

  if (
    event.detail["lastStatus"] === "STOPPED" ||
    event.detail["lastStatus"] === "RUNNING"
  ) {
    let ret;
    let msg;

    postMessage(slackMessage, function (response) {
      if (response.statusCode < 400) {
        msg =
          "Message posted successfully:" +
          response.statusCode +
          "(" +
          response.statusMessage +
          ")";
        console.info(msg);
        console.log(msg);
        context.succeed(msg);
      } else if (response.statusCode < 500) {
        msg =
          "Error posting message to Slack API: " +
          response.statusCode +
          "(" +
          response.statusMessage +
          ")";
        console.error(msg);
        console.log(msg);
        context.fail(msg);
      } else {
        msg =
          "Server error when processing message: " +
          response.statusCode +
          "(" +
          response.statusMessage +
          ")";
        console.error(msg);
        console.log(msg);
        context.fail(msg);
      }
    });

    ret = {
      body: JSON.stringify(msg),
    };

    return ret;
  }
};
