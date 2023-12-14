import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { ERC721__factory } from "../../../types/ethers-contracts/factories/ERC721__factory";
import { KMSSigner } from "@rumblefishdev/eth-signer-kms";
import { ContractTransaction, ethers } from "ethers";
export const handler: APIGatewayProxyHandler = async function (
  _event: APIGatewayProxyEvent
) {
  return await handleResponse(contract().approve("", ""));
};

const handleResponse = async (
  tx: Promise<ContractTransaction>
): Promise<APIGatewayProxyResult> => {
  try {
    const result = await tx;
    return {
      statusCode: 200,
      body: JSON.stringify({
        tx: result.hash,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: e,
      }),
    };
  }
};

const provider = () =>
  new KMSSigner(new ethers.providers.JsonRpcProvider(""), "");

const contract = () => ERC721__factory.connect("", provider());
