import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import org.apache.commons.codec.binary.Base64;

public class SchoolPaymentClient {

    public static void main(String[] args) {
        String baseURL = "http://10.1.15.91:3500";
        String uniqueID = "2";
        String username = "admin";
        String password = "password123";

        // JSON Payload for POST request
        String jsonData = "{\"studentId\": " + uniqueID + ",\"amount\": 1000.00,\"penalty\": 100.00}";

        // Call GET Method
        String callGetMethod = getRequest(baseURL + "/api/students" + uniqueID, username, password);
        System.out.println("\n************** GET METHOD RESPONSE **************\n" + callGetMethod);

        // Call POST Method
        String callPostMethod = postRequest(baseURL + "/api/payment/create", jsonData, username, password);
        System.out.println("\n************** POST METHOD RESPONSE **************\n" + callPostMethod);
    }

    // GET Request Implementation
    public static String getRequest(String urlString, String username, String password) {
        String serverResponse = "This value will be used"; 
        System.out.println(serverResponse);

        try {
            URI uri = new URI(urlString);
            URL apiUrl = uri.toURL(); // Convert URI to URL

            HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
            connection.setRequestMethod("GET");

            // Add Basic Authentication Header
            String credentials = username + ":" + password;
            String encode = Base64.encodeBase64String(credentials.getBytes());
            System.out.println("Encoded credentials: " + encode);

            connection.setRequestProperty("Authorization", "Basic " + encode);

            // Process Response
            int responseCode = connection.getResponseCode();
            serverResponse = handleResponse(connection, responseCode);

        } catch (IOException | java.net.URISyntaxException e) {
            serverResponse = "Exception: " + e.getMessage();
        }

        return serverResponse;
    }

    // POST Request Implementation
    public static String postRequest(String urlString, String data, String username, String password) {
        String serverResponse = "This value will be used"; 
        System.out.println(serverResponse);

        try {
            URI uri = new URI(urlString);
            URL apiUrl = uri.toURL(); // Convert URI to URL

            HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");

            // Add Basic Authentication Header
            String credentials = username + ":" + password;
            String encode = Base64.encodeBase64String(credentials.getBytes());
            System.out.println("Encoded credentials: " + encode);

            connection.setRequestProperty("Authorization", "Basic " + encode);

            // Send Data
            connection.setDoOutput(true);
            try (OutputStream outputStream = connection.getOutputStream()) {
                outputStream.write(data.getBytes());
                outputStream.flush();
            }

            // Process Response
            int responseCode = connection.getResponseCode();
            serverResponse = handleResponse(connection, responseCode);

        } catch (IOException | java.net.URISyntaxException e) {
            serverResponse = "Exception: " + e.getMessage();
        }

        return serverResponse;
    }

    // Helper Method: Handle API Responses
    private static String handleResponse(HttpURLConnection connection, int responseCode) throws IOException {
        StringBuilder response = new StringBuilder();
        BufferedReader reader;

        if (responseCode >= 200 && responseCode < 300) {
            // Success
            reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        } else {
            // Error
            reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
            response.append("Error ").append(responseCode).append(": ");
        }

        String inputLine;
        while ((inputLine = reader.readLine()) != null) {
            response.append(inputLine);
        }
        reader.close();

        return response.toString();
    }
}
