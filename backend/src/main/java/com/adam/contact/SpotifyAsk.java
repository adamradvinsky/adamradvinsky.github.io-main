package com.adam.contact;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@RestController
public class SpotifyAsk {




    public static void main(String[] args) {

        System.out.println(response);
    }
}


public String getToken(){

    // ask for token
    WebClient webClient = WebClient.create("https://api.spotify.com");


    
    HashMap<String, String> payload = new HashMap<String, String>();
    payload.put("client_id", "8651306640204cdf8fe0e570492b94c0");
    payload.put("code", value);
    payload.put("client_id", value);

    String response = webClient.post()
                .uri("/api/token")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
    System.out.println(response);

    return null;
}
