aws lambda add-permission 
--function-name arn:aws:lambda:eu-north-1:925476347594:function:aws-node-puppeteer-dev-hello 
--statement-id dev-aws-node-puppeteer 
--action lambda:InvokeFunction 
--source-arn arn:aws:execute-api:eu-north-1:925476347594:0exhnyc3yh/*/GET/
--principal sns.amazonaws.com

aws lambda add-permission --function-name arn:aws:lambda:eu-north-1:925476347594:function:aws-node-puppeteer-dev-hello --statement-id dev-aws-node-puppeteer --action lambda:InvokeFunction --source-arn arn:aws:execute-api:eu-north-1:925476347594:0exhnyc3yh/*/GET/ --principal sns.amazonaws.com


{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "The AWS CloudFormation template for this Serverless application",
  "Resources": {
    "ServerlessDeploymentBucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketEncryption": {
          "ServerSideEncryptionConfiguration": [
            {
              "ServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
              }
            }
          ]
        }
      }
    },
    "ServerlessDeploymentBucketPolicy": {
      "Type": "AWS::S3::BucketPolicy",
      "Properties": {
        "Bucket": {
          "Ref": "ServerlessDeploymentBucket"
        },
        "PolicyDocument": {
          "Statement": [
            {
              "Action": "s3:*",
              "Effect": "Deny",
              "Principal": "*",
              "Resource": [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":s3:::",
                      {
                        "Ref": "ServerlessDeploymentBucket"
                      },
                      "/*"
                    ]
                  ]
                }
              ],
              "Condition": {
                "Bool": {
                  "aws:SecureTransport": false
                }
              }
            }
          ]
        }
      }
    },
    "HelloLogGroup": {
      "Type": "AWS::Logs::LogGroup",
      "Properties": {
        "LogGroupName": "/aws/lambda/aws-node-puppeteer-dev-hello"
      }
    },
    "IamRoleLambdaExecution": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Principal": {
                "Service": [
                  "lambda.amazonaws.com"
                ]
              },
              "Action": [
                "sts:AssumeRole"
              ]
            }
          ]
        },
        "Policies": [
          {
            "PolicyName": {
              "Fn::Join": [
                "-",
                [
                  "aws-node-puppeteer",
                  "dev",
                  "lambda"
                ]
              ]
            },
            "PolicyDocument": {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Action": [
                    "logs:CreateLogStream",
                    "logs:CreateLogGroup"
                  ],
                  "Resource": [
                    {
                      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/aws-node-puppeteer-dev*:*"
                    }
                  ]
                },
                {
                  "Effect": "Allow",
                  "Action": [
                    "logs:PutLogEvents"
                  ],
                  "Resource": [
                    {
                      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/aws-node-puppeteer-dev*:*:*"
                    }
                  ]
                },
                {
                  "Effect": "Allow",
                  "Action": [
                    "s3:upload"
                  ],
                  "Resource": "arn:aws:s3:::masoud-user-data-bucket-123/*"
                }
              ]
            }
          }
        ],
        "Path": "/",
        "RoleName": {
          "Fn::Join": [
            "-",
            [
              "aws-node-puppeteer",
              "dev",
              {
                "Ref": "AWS::Region"
              },
              "lambdaRole"
            ]
          ]
        }
      }
    },
    "HelloLambdaFunction": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Code": {
          "S3Bucket": {
            "Ref": "ServerlessDeploymentBucket"
          },
          "S3Key": "serverless/aws-node-puppeteer/dev/1596722026322-2020-08-06T13:53:46.322Z/aws-node-puppeteer.zip"
        },
        "FunctionName": "aws-node-puppeteer-dev-hello",
        "Handler": "handler.hello",
        "MemorySize": 1024,
        "Role": {
          "Fn::GetAtt": [
            "IamRoleLambdaExecution",
            "Arn"
          ]
        },
        "Runtime": "nodejs12.x",
        "Timeout": 30
      },
      "DependsOn": [
        "HelloLogGroup"
      ]
    },
    "HelloLambdaVersionMVt2YpNCk21ZMq5QT3qIrZfsMhTCLwMNmrTr0n7A": {
      "Type": "AWS::Lambda::Version",
      "DeletionPolicy": "Retain",
      "Properties": {
        "FunctionName": {
          "Ref": "HelloLambdaFunction"
        },
        "CodeSha256": "BHnJ1RCskFxGmUYICTUwzK/7eHzo8xyYO/WDZCrN0Jg="
      }
    },
    "ApiGatewayRestApi": {
      "Type": "AWS::ApiGateway::RestApi",
      "Properties": {
        "Name": "dev-aws-node-puppeteer",
        "EndpointConfiguration": {
          "Types": [
            "EDGE"
          ]
        },
        "Policy": ""
      }
    },
    "ApiGatewayMethodGet": {
      "Type": "AWS::ApiGateway::Method",
      "Properties": {
        "HttpMethod": "GET",
        "RequestParameters": {},
        "ResourceId": {
          "Fn::GetAtt": [
            "ApiGatewayRestApi",
            "RootResourceId"
          ]
        },
        "RestApiId": {
          "Ref": "ApiGatewayRestApi"
        },
        "ApiKeyRequired": false,
        "AuthorizationType": "NONE",
        "Integration": {
          "IntegrationHttpMethod": "POST",
          "Type": "AWS_PROXY",
          "Uri": {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  "Ref": "AWS::Partition"
                },
                ":apigateway:",
                {
                  "Ref": "AWS::Region"
                },
                ":lambda:path/2015-03-31/functions/",
                {
                  "Fn::GetAtt": [
                    "HelloLambdaFunction",
                    "Arn"
                  ]
                },
                "/invocations"
              ]
            ]
          }
        },
        "MethodResponses": []
      }
    },
    "ApiGatewayDeployment1596722010241": {
      "Type": "AWS::ApiGateway::Deployment",
      "Properties": {
        "RestApiId": {
          "Ref": "ApiGatewayRestApi"
        },
        "StageName": "dev"
      },
      "DependsOn": [
        "ApiGatewayMethodGet"
      ]
    },
    "HelloLambdaPermissionApiGateway": {
      "Type": "AWS::Lambda::Permission",
      "Properties": {
        "FunctionName": {
          "Fn::GetAtt": [
            "HelloLambdaFunction",
            "Arn"
          ]
        },
        "Action": "lambda:InvokeFunction",
        "Principal": "apigateway.amazonaws.com",
        "SourceArn": {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                "Ref": "AWS::Partition"
              },
              ":execute-api:",
              {
                "Ref": "AWS::Region"
              },
              ":",
              {
                "Ref": "AWS::AccountId"
              },
              ":",
              {
                "Ref": "ApiGatewayRestApi"
              },
              "/*/*"
            ]
          ]
        }
      }
    }
  },
  "Outputs": {
    "ServerlessDeploymentBucketName": {
      "Value": {
        "Ref": "ServerlessDeploymentBucket"
      }
    },
    "HelloLambdaFunctionQualifiedArn": {
      "Description": "Current Lambda function version",
      "Value": {
        "Ref": "HelloLambdaVersionMVt2YpNCk21ZMq5QT3qIrZfsMhTCLwMNmrTr0n7A"
      }
    },
    "ServiceEndpoint": {
      "Description": "URL of the service endpoint",
      "Value": {
        "Fn::Join": [
          "",
          [
            "https://",
            {
              "Ref": "ApiGatewayRestApi"
            },
            ".execute-api.",
            {
              "Ref": "AWS::Region"
            },
            ".",
            {
              "Ref": "AWS::URLSuffix"
            },
            "/dev"
          ]
        ]
      }
    }
  }
}



