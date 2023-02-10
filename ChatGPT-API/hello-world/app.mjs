/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

import { ChatGPTAPI } from 'chatgpt'
//var ChatGPTAPI = require('chatgpt');

async function chatgptFunction(question, key) {
	// use puppeteer to bypass cloudflare (headful because of captchas)
	const api = new ChatGPTAPI({
        apiKey: key
    });
    
	const answer = await api.sendMessage(
		`${question}`
	);
	
	return answer.text;
}

export const lambdaHandler = async (event, context) => {

    const key = process.env.OPENAI_API_KEY;
    const body = JSON.parse(event.body);
    const question = body.question;
    try {
        const result = await chatgptFunction(question, key);
        return {
           
            'statusCode': 200,
            'body': JSON.stringify({
                question: question,
                reply: result,
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};
