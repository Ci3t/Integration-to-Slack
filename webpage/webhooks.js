// using axios to send to slack

//!sending new user that signed up with name and email to slack

axios.post(process.env.SLACK_WEBHOOK, {
  channel: process.env.SLACK_CHANNELID,
  attachments: [
    {
      color: "#35b9e6",
      text:
        ":tada:" + " *" + `New User: ${user.name} has signed up` + "*" + "\n",
      author_name: user.email, // if you use zapier to take email from slack message you need to add this (so you dont get mailto:email in zapier)
      fields: [
        {
          title: "ID",
          value: `${user.id}`,
          short: "true",
        },
        {
          title: "Email",
          value: `${user.email}`,
          short: "true",
        },
      ],
    },
  ],
});

//using axios with loop array of obj's
// will post values from  array of objects

axios.post(process.env.SLACK_WEBHOOK, {
  channel: process.env.SLACK_CHANNELID,

  attachments: [
    {
      color: "#35b9e6",
      text:
        ":tada:" +
        " *" +
        `User: ${user.name} has Changed Settings` +
        "*" +
        "\n",
      fields: Object.entries(req.body).map(([key, value]) => {
        console.log(value.key);
        console.log(value.value);
        return {
          title: value.key,
          value: value.value,
          short: true,
        };
      }),
    },
  ],
});

//send to if value is array or string
//! if you have some fields as string and array of strings this will loop and post it as strings into slack and make no issues
axios.post(process.env.SLACK_WEBHOOK, {
  channel: process.env.SLACK_CHANNELID,

  attachments: [
    {
      color: "#e3c22d",
      text:
        ":gear:" + " *" + `Settings Changed for : ${user.name} ` + "*" + "\n",
      fields: Object.entries(req.body).map(([key, value]) => {
        console.log(value.key);
        console.log(value.value);
        if (Array.isArray(value.value)) {
          return {
            title: value.key,
            value: value.value.join(" "),
            short: true,
          };
        } else {
          return {
            title: value.key,
            value: value.value,
            short: true,
          };
        }
      }),
    },
  ],
});
