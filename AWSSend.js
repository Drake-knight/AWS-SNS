const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
      },
      body: '',
    };
    return response;
  }

  try {
    const sns = new AWS.SNS();


    const topicArn = 'ARN of topic';


    let payload = {
      default: 'default',
      GCM: {
        notification: {
          body: '-----||------',
          title: 'hehe',
          sound: 'default',
        },
      },
      APNS: {
        aps: {
          alert: {
            title: 'Ya Hello Again',
            body: 'Hello'
          },
          sound: 'default'
        }
      }
    };

    payload.GCM = JSON.stringify(payload.GCM);
    payload.APNS = JSON.stringify(payload.APNS);
    payload = JSON.stringify(payload);


    const publishParams = {
      Message: payload,
      TopicArn: topicArn,
      MessageStructure: 'json',
    };

    await sns.publish(publishParams).promise();

    console.log('Push notification sent successfully.');

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
      },
      body: 'Push notification sent successfully!',
    };

    console.log('Response:', response);

    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
      },
      body: 'Error sending push notification',
    };

    console.log('Error response:', response);

    return response;
  }
};
