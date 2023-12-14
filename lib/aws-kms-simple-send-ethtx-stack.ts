import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { resourceId } from "./constants";

export class AwsKmsSimpleSendEthtxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mintFunc = new NodejsFunction(this, resourceId("mintFunc"), {
      functionName: resourceId("mintFunc"),
      entry: "lib/lambda/api/index.ts",
      handler: "handler",
      timeout: cdk.Duration.minutes(15),
    });

    const api = restApi(this);
    api.root.addResource("mint").addMethod(
      "POST",
      new LambdaIntegration(mintFunc, {
        allowTestInvoke: true,
        timeout: cdk.Duration.seconds(29),
      })
    );
  }
}

const restApi = (scope: cdk.Stack) => {
  const apiGateway = new RestApi(scope, resourceId("api"), {
    restApiName: resourceId("api"),
    defaultMethodOptions: {
      apiKeyRequired: true,
    },
  });
  const apiKey = apiGateway.addApiKey(resourceId("apiKey"), {
    apiKeyName: resourceId("apiKey"),
  });
  const usagePlan = apiGateway.addUsagePlan(resourceId("usagePlan"));
  usagePlan.addApiKey(apiKey);
  usagePlan.addApiStage({ stage: apiGateway.deploymentStage });
  return apiGateway;
};
