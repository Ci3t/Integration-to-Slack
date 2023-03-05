// will send an alarm message to slack on certain cpu %
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

  // parse the message from the SNS alarm
  let message = JSON.parse(event.Records[0].Sns.Message);
  let alarmName = message.AlarmName;
  let alarmDesc = message.AlarmDescription;
  let newState = message.NewStateValue;
  let reason = message.NewStateReason;
  let time = message.StateChangeTime;
  let threshold = message.Threshold;
  let clusterName = message.ClusterName;

  let icon = ":rotating_light:";
  let icon2 = ":red_circle:";

  let serviceName = "CPU Usage Alarm " + alarmDesc;
  let statusColor = "good";

  // set state color
  switch (newState) {
    case "OK":
      statusColor = "good";
      icon2 = ":large_green_circle:";
      break;
    case "ALARM":
      statusColor = "danger";
      icon2 = ":red_circle:";
      break;
    default:
      break;
  }

  // set post message
  const slackMessage = {
    channel: process.env["slackChannel"],
    attachments: [
      {
        color: statusColor,
        text: icon + " *" + serviceName + "*" + "\n",
        fields: [
          {
            title: "Date Time",
            value: time,
            short: "true",
          },
          {
            title: "Alarm Name",
            value: alarmName,
            short: "true",
          },
          {
            title: "Cluster Name", // added field for cluster name
            value: alarmDesc,
            short: "true",
          },
          {
            title: "Region", // added field for cluster name
            value: message.Region,
            short: "true",
          },
          {
            title: icon2 + "  State",
            value: newState,
            short: "true",
          },
          {
            title: "Reason",
            value: reason,
            short: "false",
          },
        ],
      },
    ],
  };

  let ret;
  let msg;

  postMessage(slackMessage, function (response) {
    if (response.statusCode < 400) {
      console.info("Message posted successfully");
      ret = {
        statusCode: 200,
        body: "Message posted successfully",
      };
    } else if (response.statusCode < 500) {
      console.error(
        "Error posting message to Slack API: " +
          response.statusCode +
          " - " +
          response.statusMessage,
      );
      ret = {
        statusCode: response.statusCode,
        body: "Error posting message to Slack API: " + response.statusMessage,
      };
    } else {
      console.error(
        "Server error when processing message: " +
          response.statusCode +
          " - " +
          response.statusMessage,
      );
      ret = {
        statusCode: response.statusCode,
        body: "Server error when processing message: " + response.statusMessage,
      };
    }
    context.succeed(ret);
  });
};
