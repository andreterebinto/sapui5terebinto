# Platform skillTest

## Example

Platform developed to perform API consumption tests with demo in Dashboard.

#### Frameworks and tools used

As requested, openSources tools were used based on JAVASCRIPT, HTML and CSS described below:
- SAPUI5 (Framework SAP);
- OpenLayers (Maps OpenSource);
- AMCharts (Javascript Dashboards);
- Docker (Container development)

#### API OpenWeather https://openweathermap.org/api

API that consists of returning JSON data of general weather from cities, countries and states.

## Installation

1- Install [Docker](https://www.docker.com/products/docker-desktop "Docker Download") locally or use environments that contain docker.  
2- After installing docker create a file called docker-compose.yml on your local machine.  
3- Copy and paste the code below into the file.  
```json
version: '3'
services:
    server:
        image: andreterebinto/testapp:sapui5
        ports:
            - "8080:8080"

```

4- Access your machine's terminal, and enter the folder where you saved the docker-compose.yml file  
5- type the command "docker-compose up", with that the project will be executed.  
6- Access the browser http://localhost:8080/index.html 

###### NOTE: If you can't create the file, it exists here in the project's repository, in the root folder.
-----

## Helper

If no way above is possible, it is possible to download the docker image directly from dockerHub, with the following command.
```json
docker pull andreterebinto/testapp:sapui5
```

## Author

Andre Terebinto, andreterebinto@hotmail.com