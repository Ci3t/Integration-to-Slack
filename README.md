## AWS

# slack-ec2-stateChange-Hook
#ECS Task notifier
<div>
<!--   <img src="https://gcdnb.pbrd.co/images/uZatQYdKXR4h.jpg?o=1" width="500px"> -->
<img src="https://github.com/Ci3t/Integration-to-Slack/blob/main/preview/ECS-Task.jpg?raw=true" width="500">

  </div>


EC2 Enable AWS CloudTrail.

<!-- <img src="https://gcdnb.pbrd.co/images/AZB55CnwuIef.jpg?o=1" width="500px"> -->

<img src="https://github.com/Ci3t/Integration-to-Slack/blob/main/preview/EC2-State-Change.jpg?raw=true" width="500">


Create Amazon CloudWatch event rule.

Event pattern Service Name EC2 Event type EC2 Instance State-change Notification State Any *1 Instance Any *1 Target Lambda function *1 : Change when specifying a specific state or instance.

Create Lambda function with this code.



# Rds Alarm via SNS

make sns topic 

make cloudwatch alarm with cpu util 

connect and sub to this lambda 

<!--<img src="https://gcdnb.pbrd.co/images/7YtJ3Wq3RWL4.jpg?o=1" width="500px"> -->

<img src="https://github.com/Ci3t/Integration-to-Slack/blob/main/preview/RDS-ALARM.jpg?raw=true" width="500">



## Webpage integration 

depened on what you need use the correct webhook from the webpage folder 

S3BucketToSLack - will make you upload a file to AWS first then send it to slack as link in this case CSV 

webhooks - will send messages to slack without files for example : when user Register 
or when user Complete onBoarding or change settings to his account 

<!--<img src="https://gcdnb.pbrd.co/images/UGqceLG1SiML.jpg?o=1" width="500px">-->
<img src="https://github.com/Ci3t/Integration-to-Slack/blob/main/preview/Signup-ToSlack.jpg?raw=true" width="500">
