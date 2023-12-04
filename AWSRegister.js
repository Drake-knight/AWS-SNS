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
    const { deviceToken, platform } = JSON.parse(event.body);

    console.log('Received deviceToken:', deviceToken);


    const topicArn = 'arn:aws:sns:eu-north-1:425778390810:esssumit';


    const platformApplicationArn = platform === 'ios'
      ? 'apple-platorm-arn'
      : 'android-platorm-arn';


    const createEndpointParams = {
      PlatformApplicationArn: platformApplicationArn,
      Token: deviceToken,
    };

    const createEndpointResponse = await sns.createPlatformEndpoint(createEndpointParams).promise();
    const endpointArn = createEndpointResponse.EndpointArn;


    const subscribeParams = {
      Protocol: 'application',
      TopicArn: topicArn,
      Endpoint: endpointArn,
    };

    await sns.subscribe(subscribeParams).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
      },
      body: 'Device registration successful!',
    };

    console.log('Response:', response);

    return response;
  } catch (error) {
    console.error('Error registering device token:', error);
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
      },
      body: 'Error registering device token',
    };

    console.log('Error response:', response);

    return response;
  }
};
