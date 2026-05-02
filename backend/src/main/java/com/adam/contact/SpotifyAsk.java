package com.adam.contact;

import java.util.Base64;

import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import reactor.core.publisher.Mono;

@Controller
public class SpotifyAsk {

    private final WebClient client;

    private String authorization;
    private String client_id = "8651306640204cdf8fe0e570492b94c0";
    private String client_secret = "80e7ec5d2c1849c28f9d911a36249acf";
    private String redirect_url = "http://127.0.0.1:8080/callback";

    private String secondAuth = client_id + ":" + client_secret;
    private String encodedSecondAuth = Base64.getEncoder().encodeToString(secondAuth.getBytes());
    private String token;

    public SpotifyAsk(WebClient webclient) {
        this.client = webclient;
    }

    @GetMapping("/login")
    public String requestAuthorization() {

        return "redirect:https://accounts.spotify.com/authorize"
                + "?response_type=code"
                + "&client_id=" + client_id
                + "&redirect_uri=" + redirect_url;
    }

    @GetMapping("/callback")
    public String loggedIn(String code) {

        System.out.println("thanks for logging in, also the code is " + code);

        TokenResponse tokenresponse = getAuthorizationToken(code).block();

        if (tokenresponse != null) {
            System.out.println("got the freaking token");
            System.out.println(tokenresponse.getToken());
            setToken(tokenresponse.getToken());
        } else {
            System.out.print("uh oh couldnt get token");
        }

        return "redirect:https://adamradvinsky.com";
    }

    public Mono<TokenResponse> getAuthorizationToken(String authorization) {
        System.out.print("WE ARE ASKING FOR A TOKEN");
        LinkedMultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", authorization);
        body.add("redirect_uri", redirect_url);

        return client.post()
                .uri("https://accounts.spotify.com/api/token")
                .header("Authorization", "Basic " + encodedSecondAuth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(TokenResponse.class);
    }

    // @ResponseBody
    // // @CrossOrigin(origins = "*")
    // @CrossOrigin(origins="*")
    // @GetMapping("/spotifydisplay")
    // public Mono<topArtists> requestArtistData() {
    //     return client.get()
    //             .uri("https://api.spotify.com/v1/me/top/artists")
    //             .header("Authorization", "Bearer " + getToken())
    //             .retrieve()
    //             .bodyToMono(topArtists.class);
    // }
    @ResponseBody
    @CrossOrigin(origins = "*")
    @GetMapping("/spotifydisplay")
    public String requestArtistData() {
        String bruh = getToken();

        return bruh;
    }

    public void setAuthorization(String a) {
        this.authorization = a;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String newToken) {
        token = newToken;
    }

}

@JsonIgnoreProperties(ignoreUnknown = true)
class TokenResponse {

    private String access_token;
    private String token_type;
    private String scope;
    private int expires_in;
    private String refresh_token;

    public String getToken() {
        return access_token;
    }

    public String getAccess_token() {
        return access_token;
    }

    public String getToken_type() {
        return token_type;
    }

    public String getScope() {
        return scope;
    }

    public int getExpires_in() {
        return expires_in;
    }

    public String getRefresh_token() {
        return refresh_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public void setExpires_in(int expires_in) {
        this.expires_in = expires_in;
    }

    public void setRefresh_token(String refresh_token) {
        this.refresh_token = refresh_token;
    }

}

@JsonIgnoreProperties(ignoreUnknown = true)
class topArtists {

    public String href;
    public int limit;
    public String next;
    public int offset;
    public String previous;
    public int total;
    public Artist_Object[] items;

}

@JsonIgnoreProperties(ignoreUnknown = true)
class Artist_Object {

    public external_urls_Object external_urls;
    public followers_Object followers;
    public String[] genres;
    public String href;
    public String id;
    public images_object[] images;
    public String name;
    public int popularity;
    public String type;
    public String uri;

}

@JsonIgnoreProperties(ignoreUnknown = true)
class external_urls_Object {

    public String spotify;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class followers_Object {

    public String href;
    public int total;
}

@JsonIgnoreProperties(ignoreUnknown = true)
class images_object {

    public String url;
    public int height;
    public int width;

}
