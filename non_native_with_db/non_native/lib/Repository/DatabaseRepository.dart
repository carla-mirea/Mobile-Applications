import 'dart:io';
import 'package:flutter/material.dart';
import 'package:non_native/Concert.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseRepo {
  static const _dbName = "concerts.db";
  static const _dbVersion = 1;
  static const _table = "concert";

  DatabaseRepo._();

  static final DatabaseRepo dbInstance = DatabaseRepo._();

  static Database? _database;

  Future<Database> get database async => _database ??= await _initDatabase();

  Future<Database> _initDatabase() async {
    Directory documentsDirectory = await getApplicationDocumentsDirectory();
    String path = join(documentsDirectory.path, _dbName);

    return await openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
    );
  }

  void _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        performers TEXT NOT NULL
      )
    ''');
  }

  Future<List<Concert>> getConcerts() async {
    Database db = await dbInstance.database;

    var concerts = await db.query(_table);

    List<Concert> concertList = concerts.isNotEmpty
        ? concerts.map((c) => Concert.fromMap(c)).toList()
        : [];

    return concertList;
  }

  Future<int> add(Concert concert) async {
    Database db = await dbInstance.database;

    return await db.insert(_table, concert.toMap());
  }

  Future<void> removeFromList(int id) async {
    final db = await database;
    try {
      await db.delete(
        _table,
        where: 'id = ?',
        whereArgs: [id],
      );
      debugPrint('The concert was DELETED $id');
    } catch (e) {
      throw Exception("Failed to delete concert with ID $id: $e");
    }
  }

  Future<int> update(Concert concert) async {
    try {
      Database db = await dbInstance.database;

      //final List<Map<String, dynamic>> result =
        //  await db.rawQuery('SELECT * FROM $_table');
      //debugPrint(result.toString());

      int? id = concert.id;

      return await db.update(
        _table,
        concert.toMap(),
        where: 'id = ?',
        whereArgs: [id],
      );
    } catch (e) {
      throw Exception('Database update failed');
    }
  }
}
