import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:non_native/Screens/ListConcerts.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

void main() async {
  // Initialize database factory for non-mobile platforms
  WidgetsFlutterBinding.ensureInitialized();
  if (!kIsWeb && (defaultTargetPlatform == TargetPlatform.windows || defaultTargetPlatform == TargetPlatform.linux || defaultTargetPlatform == TargetPlatform.macOS)) {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }
  
  runApp(const MaterialApp(
      home: ListConcerts()
  )
  );
}
