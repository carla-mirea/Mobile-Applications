import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketService {
  final WebSocketChannel channel;

  WebSocketService(String url) : channel = WebSocketChannel.connect(Uri.parse(url));

  void sendMessage(String message) {
    channel.sink.add(message);
  }

  void listenForMessages() {
    channel.stream.listen((message) {
      print("Received from server: $message");
    });
  }

  void dispose() {
    channel.sink.close();
  }
}
