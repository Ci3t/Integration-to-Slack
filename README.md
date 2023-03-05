## AWS

# slack-ec2-stateChange-Hook
#ECS Task notifier
<img src="https://pasteboard.co/uZatQYdKXR4h.jpg" width="200px">


EC2 Enable AWS CloudTrail.

<img src="https://pasteboard.co/AZB55CnwuIef.jpg" width="200px">



Create Amazon CloudWatch event rule.

Event pattern Service Name EC2 Event type EC2 Instance State-change Notification State Any *1 Instance Any *1 Target Lambda function *1 : Change when specifying a specific state or instance.

Create Lambda function with this code.



# Rds Alarm via SNS

make sns topic 

make cloudwatch alarm with cpu util 

connect and sub to this lambda 

<img src="https://pasteboard.co/7YtJ3Wq3RWL4.jpg" width="200px">



## Webpage integration 

depened on what you need use the correct webhook from the webpage folder 

S3BucketToSLack - will make you upload a file to AWS first then send it to slack as link in this case CSV 

webhooks - will send messages to slack without files for example : when user Register 
or when user Complete onBoarding or change settings to his account 

<img src="https://pasteboard.co/UGqceLG1SiML.jpg" width="200px">