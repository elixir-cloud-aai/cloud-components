# Description

See the human-readable [Reference Documentation](https://ga4gh.github.io/data-repository-service-schemas/docs/).

## postDrsObject

Posts/Create a new object.

**API Request Body**

| Parameter  | Type   | Description                                                              |
| ---------- | ------ | ------------------------------------------------------------------------ |
| `objectData` | object | The data of the object to be posted.                                   |
|            |        | This should be an object containing the necessary fields for the object. |
|            |        | Modify the structure according to your object requirements.              |

## deleteObject

Deletes a specific drs object.

**API Request Body**

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `baseURL` | string | Base URL for deleting object   |
| `id`      | string | ID of the object to be deleted |


![Logo]('./../../../../images/logo-elixir.svg)
![Logo]('./../../../../images/logo-elixir-cloud-aai.svg)

