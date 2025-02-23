import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:non_native/Screens/ListConcerts.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'WebsocketService.dart';

void main() async {
  // Initialize database factory for non-mobile platforms
  WidgetsFlutterBinding.ensureInitialized();
  if (!kIsWeb && (defaultTargetPlatform == TargetPlatform.windows || defaultTargetPlatform == TargetPlatform.linux || defaultTargetPlatform == TargetPlatform.macOS)) {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }

  // Initialize WebSocketService
  WebSocketService webSocketService = WebSocketService('ws://localhost:8080'); // the localhost has to be changed with the actual IP address or 10.0.2.2 for Android emulator
  webSocketService.listenForMessages();

  // Send a test message to the server
  webSocketService.sendMessage('Hello from Flutter!');
  
  runApp(const MaterialApp(
      home: ListConcerts()
  )
  );
}
