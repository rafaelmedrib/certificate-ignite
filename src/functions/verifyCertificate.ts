import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

interface IUserCertificate {
  id: string;
  name: string;
  grade: string;
  createdAt: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: 'users_certificate',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  }).promise()

  const userCertificate = response.Items[0] as IUserCertificate;

  if(userCertificate){
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Certificado válido',
        name: userCertificate.name,
        url: `https://certificateignite1989.s3.amazonaws.com/${id}.pdf`
      })
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Certicado não encontrado'  
    })
  }
}