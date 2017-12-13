package zfi.forge;

import com.google.gson.Gson;
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
        setProxy();
        port(45000);
        staticFileLocation("/");
        before((req, resp) -> {
            resp.header("Access-Control-Allow-Origin","*");
        });

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

    private static void setProxy() {
        HttpClientBuilder clientBuilder = HttpClientBuilder.create();


        CredentialsProvider credsProvider = new BasicCredentialsProvider();

        credsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials("", ""));

        clientBuilder.useSystemProperties();

        clientBuilder.setProxy(new HttpHost("proxy.picompany.ru", 8080));
        clientBuilder.setDefaultCredentialsProvider(credsProvider);
        clientBuilder.setProxyAuthenticationStrategy(new ProxyAuthenticationStrategy());


        Lookup<AuthSchemeProvider> authProviders = RegistryBuilder.<AuthSchemeProvider>create()
                .register(AuthSchemes.BASIC, new BasicSchemeFactory())
                .build();
        clientBuilder.setDefaultAuthSchemeRegistry(authProviders);

        Unirest.setHttpClient(clientBuilder.build());
    }
}
