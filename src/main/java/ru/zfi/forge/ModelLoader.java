package ru.zfi.forge;

import com.mashape.unirest.http.Unirest;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthSchemeProvider;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.config.AuthSchemes;
import org.apache.http.config.Lookup;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.impl.auth.BasicSchemeFactory;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.ProxyAuthenticationStrategy;

import static spark.Spark.*;

public class ModelLoader {
    public static void main(String[] args) {
        port(getHerokuAssignedPort());
        staticFileLocation("/public");

        if (args.length > 0 && args[0].equals("debug")) {
            if (args.length >= 5 && args[1].equals("proxy"))
                setProxy(args[2], Integer.parseInt(args[3]), args[4], args[5]);
            before((req, resp) -> resp.header("Access-Control-Allow-Origin", "*"));
        }

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

    static int getHerokuAssignedPort() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
        return 45000;
    }

    private static void setProxy(String address, int port, String userName, String password) {
        HttpClientBuilder clientBuilder = HttpClientBuilder.create();


        CredentialsProvider credsProvider = new BasicCredentialsProvider();

        credsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(userName, password));

        clientBuilder.useSystemProperties();

        clientBuilder.setProxy(new HttpHost(address, port));
        clientBuilder.setDefaultCredentialsProvider(credsProvider);
        clientBuilder.setProxyAuthenticationStrategy(new ProxyAuthenticationStrategy());


        Lookup<AuthSchemeProvider> authProviders = RegistryBuilder.<AuthSchemeProvider>create()
                .register(AuthSchemes.BASIC, new BasicSchemeFactory())
                .build();
        clientBuilder.setDefaultAuthSchemeRegistry(authProviders);

        Unirest.setHttpClient(clientBuilder.build());
    }
}
