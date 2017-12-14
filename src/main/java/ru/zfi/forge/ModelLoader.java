package ru.zfi.forge;

import com.mashape.unirest.http.Unirest;

import static spark.Spark.*;

public class ModelLoader {
    public static void main(String[] args) {
        port(8080);
        staticFileLocation("/");

//        before((req, resp) -> {
//            resp.header("Access-Control-Allow-Origin","*");
//        });

        get("/hello", (req, res) -> "Hello World");
        get("/getToken", "application/json", (req, res) -> {
            String appId = req.queryParams("appId");
            String secret = req.queryParams("secret");

            return Unirest.post("https://developer.api.autodesk.com/authentication/v1/authenticate")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .field("client_id", appId)
                    .field("client_secret", secret)
                    .field("grant_type", "client_credentials")
                    .field("scope", "data:read data:write bucket:create bucket:read")
                    .asJson().getBody().toString();
        });
    }
}
