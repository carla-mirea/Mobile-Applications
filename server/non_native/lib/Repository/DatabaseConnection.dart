import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path_provider/path_provider.dart';

class DatabaseConnection {
  Future<Database> setDatabase() async {
    var directory = await getApplicationDocumentsDirectory();
    var path = join(directory.path, 'db_concerts');
    var database = await openDatabase(
      path,
      version: 1,
      onCreate: _onCreatingDatabase,
    );

    return database;
  }

  _onCreatingDatabase(Database database, int version) async {
    await database.execute(
      '''CREATE TABLE concert 
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        performers TEXT NOT NULL
      )'''
    );
  }
}
