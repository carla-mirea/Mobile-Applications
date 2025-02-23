class NetworkException implements Exception {
  final String message;
  NetworkException([this.message = '']);
}

class ServerDownException implements Exception {
  final String message;
  ServerDownException([this.message = '']);
}