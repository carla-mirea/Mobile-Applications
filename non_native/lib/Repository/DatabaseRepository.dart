import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:non_native/Concert.dart';

class DatabaseRepo {
  static const String _baseUrl = "http://localhost:3000/api/concerts";

  DatabaseRepo._();

  static final DatabaseRepo dbInstance = DatabaseRepo._();

  Future<List<Concert>> getConcerts() async {
    try {
      final response = await http.get(Uri.parse(_baseUrl));
      if (response.statusCode == 200) {
        List<dynamic> jsonData = json.decode(response.body);
        return jsonData.map((concert) => Concert.fromMap(concert)).toList();
      } else {
        throw Exception('Failed to load concerts');
      }
    } catch (e) {
      debugPrint('Error fetching concerts: $e');
      throw Exception("Server is unavailable. Please try again later.");
    }
  }

  Future<int> add(Concert concert) async {
    try {
      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(concert.toMap()),
      );

      if (response.statusCode == 201) {
        final jsonData = json.decode(response.body);
        return jsonData['id'];
      } else {
        throw Exception('Failed to create concert');
      }
    } catch (e) {
      debugPrint('Error adding concert: $e');
      throw Exception("Server is unavailable. Please try again later.");
    }
  }

  Future<void> removeFromList(int id) async {
    try {
      final response = await http.delete(Uri.parse("$_baseUrl/$id"));
      if (response.statusCode != 200) {
        throw Exception('Failed to delete concert');
      }
    } catch (e) {
      debugPrint('Error deleting concert: $e');
      throw Exception("Server is unavailable. Please try again later.");
    }
  }

  Future<void> update(Concert concert) async {
    try {
      final response = await http.put(
        Uri.parse("$_baseUrl/${concert.id}"),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(concert.toMap()),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to update concert');
      }
    } catch (e) {
      debugPrint('Error updating concert: $e');
      throw Exception("Server is unavailable. Please try again later.");
    }
  }
}
