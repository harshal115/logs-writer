Add logs

Request method : PUT
Endpoint:               {baseUrl}/logs

Request body:
{
"fileName": <reference filename>,
"logs": <stringified logs>
}

Response body:
Sample respose:
{
    "status": 1000 (for success) / 1001 (for failure),
    "message": <status message>
}

Sample request:
localhost:8080/logs

Sample respose:
{
    "status": 1000,
    "message": "logs saved successfully"
}



---------------------------------------------------------------------



Get logs 

Request method : GET
Endpoint:               {baseUrl}/logs

Query Param:
fileName

Response body:
{
    "status": 2000 (for success) / 2001 (for failure),
    "message": <status message>,
    "data": <logs>
}

Sample request:
localhost:8080/logs?fileName=test

Sample respose:
{
    "status": 2000,
    "message": "logs loaded successfully",
    "data": "test log\nanother test log\nyet another test log\n"
}