package zfi.forge;

import com.google.gson.Gson;
import com.mashape.unirest.http.Unirest;

import static spark.Spark.*;

public class ModelLoader {
    public static void main(String[] args) {
        staticFileLocation("/");
        get("/hello", (req, res) -> "Hello World");
        get("/getToken", (req, res) -> {
            String appId = req.queryParams("appId");
            String secret = req.queryParams("secret");

            Gson gson = new Gson();
            String respBody = Unirest.post("https://developer.api.autodesk.com/authentication/v1/authenticate")
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .field("client_id", appId)
                    .field("client_secret", secret)
                    .field("grant_type", "client_credentials")
                    .field("scope", "data:read%20data:write%20bucket:read%20bucket:create%20bucket:write")
                    .asString().getBody();
            TokenResponce resp = gson.fromJson(respBody, TokenResponce.class);
            return resp.access_token;
        });
    }

    class TokenResponce {
        String access_token;
        String token_type;
        int expires_in;
    }
}
