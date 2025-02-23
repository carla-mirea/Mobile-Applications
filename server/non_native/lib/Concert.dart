import 'package:intl/intl.dart';

class Concert {
  static int currentId = 0;
  int? id;
  String name;
  String description;
  DateTime date;
  String location;
  List<String> performers;

  Concert({
    this.id,
    required this.name,
    required this.description,
    required this.date,
    required this.location,
    required this.performers,
  });

  String formatPerformers() {
    return "Performers: ${performers.join(', ')}";
  }

  String formatPerformersEditForm() {
    return performers.join(', ');
  }

  @override
  String toString() {
    return "$name - $description - ${DateFormat('yyyy-MM-dd').format(date)} - $location - ${formatPerformers()}";
  }

  factory Concert.fromMap(Map<String, dynamic> json) => Concert(
    id: json['id'],
    name: json['name'],
    description: json['description'],
    date: DateTime.parse(json['date']),
    location: json['location'],
    performers: List<String>.from(json['performers']),
  );

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'date': date.toIso8601String(),
      'location': location,
      'performers': performers.join(','),
    };
  }

  static List<Concert> init() {
    List<Concert> concerts = [
      Concert(
        name: "Rock Revolution",
        description: "An electrifying night of classic and modern rock music.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 03, 15))),
        location: "Madison Square Garden, New York",
        performers: ["The Rolling Stones", "Imagine Dragons"],
      ),
      Concert(
        name: "Symphony of Lights",
        description: "A mesmerizing orchestral performance with light shows.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 04, 22))),
        location: "Sydney Opera House, Sydney",
        performers: ["Sydney Symphony Orchestra"],
      ),
      Concert(
        name: "Pop Paradise",
        description: "Experience the best of pop music under the stars.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 05, 10))),
        location: "Hollywood Bowl, Los Angeles",
        performers: ["Taylor Swift", "Harry Styles"],
      ),
      Concert(
        name: "Jazz & Blues Fest",
        description: "An evening of soulful jazz and blues performances.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 06, 18))),
        location: "Preservation Hall, New Orleans",
        performers: ["Louisiana Jazz Band", "John Mayer Trio"],
      ),
      Concert(
        name: "Electronic Vibes",
        description: "A high-energy electronic music festival.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 07, 25))),
        location: "Tomorrowland, Boom, Belgium",
        performers: ["Calvin Harris", "David Guetta", "Marshmello"],
      ),
      Concert(
        name: "Folk Fiesta",
        description:
            "Celebrate the roots of music with folk artists from around the globe.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 08, 05))),
        location: "Red Rocks Amphitheatre, Colorado",
        performers: ["Mumford & Sons", "The Lumineers"],
      ),
      Concert(
        name: "Hip-Hop Mania",
        description: "A night of beats and bars with top hip-hop artists.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 09, 12))),
        location: "Barclays Center, Brooklyn",
        performers: ["Kendrick Lamar", "Cardi B", "J. Cole"],
      ),
      Concert(
        name: "Classical Extravaganza",
        description: "A timeless collection of classical masterpieces.",
        date: DateTime.parse(
            DateFormat('yyyy-MM-dd').format(DateTime(2024, 10, 30))),
        location: "Royal Albert Hall, London",
        performers: ["London Philharmonic Orchestra"],
      ),
    ];

    return concerts;
  }

}
