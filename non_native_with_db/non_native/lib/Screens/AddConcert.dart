import 'package:flutter/material.dart';
import 'package:non_native/Concert.dart';
import 'package:non_native/Repository/DatabaseRepository.dart';

class AddConcert extends StatefulWidget {
  final void Function(Concert concert) onConcertAdded;

  AddConcert({required this.onConcertAdded});

  @override
  _AddConcertState createState() => _AddConcertState();
}

class _AddConcertState extends State<AddConcert> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  String description = '';
  DateTime? date;
  String location = '';
  List<String> performers = [];

  bool isValidDate(String dateString) {
    try {
      DateTime.parse(dateString);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> saveConcert() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      final newConcert = Concert(
        name: name,
        description: description,
        date: date!,
        location: location,
        performers: performers,
      );

      try {
        await DatabaseRepo.dbInstance.add(newConcert);
        debugPrint('The concert was ADDED $newConcert');
        widget.onConcertAdded(newConcert);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Concert added successfully!')),
        );
        Navigator.pop(context);
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add concert: $e')),
        );
      }
    }
  }

  void cancelAction() {
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: cancelAction,
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/confetti_background.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Container(
                margin: const EdgeInsets.all(20),
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: const Color(0xFF0C1A2D).withOpacity(0.9),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Add Concert',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 28),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Concert Name',
                        labelStyle: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                        ),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.2),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      style: const TextStyle(
                        color: Color(0xFFB7B7B7),
                        fontSize: 16,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the concert name';
                        }
                        return null;
                      },
                      onSaved: (value) => name = value!,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Description',
                        labelStyle: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                        ),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.2),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      style: const TextStyle(
                        color: Color(0xFFB7B7B7),
                        fontSize: 16,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the description';
                        }
                        return null;
                      },
                      onSaved: (value) => description = value!,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Date (yyyy-mm-dd)',
                        labelStyle: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                        ),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.2),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      style: const TextStyle(
                        color: Color(0xFFB7B7B7),
                        fontSize: 16,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the date';
                        } else if (!isValidDate(value)) {
                          return 'Invalid date format! Please use yyyy-mm-dd';
                        }
                        return null;
                      },
                      onSaved: (value) => date = DateTime.parse(value!),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Location',
                        labelStyle: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                        ),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.2),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      style: const TextStyle(
                        color: Color(0xFFB7B7B7),
                        fontSize: 16,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the location';
                        }
                        return null;
                      },
                      onSaved: (value) => location = value!,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      decoration: InputDecoration(
                        labelText: 'Performers (comma separated)',
                        labelStyle: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                        ),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.2),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      style: const TextStyle(
                        color: Color(0xFFB7B7B7),
                        fontSize: 16,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the performers';
                        }
                        return null;
                      },
                      onSaved: (value) =>
                          performers = value!.split(',').map((e) => e.trim()).toList(),
                    ),
                    const SizedBox(height: 36),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: saveConcert,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF27405F),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Add',
                              style: TextStyle(fontSize: 26),
                            ),
                          ),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: cancelAction,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF572018),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Cancel',
                              style: TextStyle(fontSize: 26),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
