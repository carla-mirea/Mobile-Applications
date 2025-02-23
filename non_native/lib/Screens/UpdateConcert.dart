import 'package:flutter/material.dart';
import 'package:non_native/Concert.dart';
import 'package:non_native/Repository/DatabaseRepository.dart';

class UpdateConcert extends StatefulWidget {
  final Concert concert;
  final void Function(Concert updatedConcert) onConcertUpdated;

  UpdateConcert({required this.concert, required this.onConcertUpdated});

  @override
  _UpdateConcertState createState() => _UpdateConcertState();
}

class _UpdateConcertState extends State<UpdateConcert> {
  final _formKey = GlobalKey<FormState>();
  late String name;
  late String description;
  late String date;
  late String location;
  late String performers;
  String? _errorMessage;

  bool isValidDate(String dateString) {
    try {
      DateTime.parse(dateString);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> saveUpdatedConcert() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      final updatedConcert = Concert(
        id: widget.concert.id,
        name: name,
        description: description,
        date: DateTime.parse(date),
        location: location,
        performers: performers.split(',').map((p) => p.trim()).toList(),
      );

      try {
        await DatabaseRepo.dbInstance.update(updatedConcert);

        debugPrint('Concert updated successfully: $updatedConcert');
        widget.onConcertUpdated(updatedConcert);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Concert updated successfully!')),
        );
        Navigator.pop(context, updatedConcert);
      } catch (e) {
        debugPrint('Failed to update concert: $e');
        _errorMessage = e.toString();
        _showErrorSnackBar(_errorMessage!);
      }
    }
  }

   void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 5),
      ),
    );
  }

  void cancelAction() {
    Navigator.pop(context);
  }

  @override
  void initState() {
    super.initState();
    name = widget.concert.name;
    description = widget.concert.description;
    date = widget.concert.date.toIso8601String().split('T').first;
    location = widget.concert.location;
    performers = widget.concert.performers.join(', ');
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
          onPressed: () => Navigator.pop(context),
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
                      'Update Concert',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 28),
                    TextFormField(
                      initialValue: name,
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
                      validator: (value) => value == null || value.isEmpty
                          ? 'Please enter the concert name'
                          : null,
                      onSaved: (value) => name = value!,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      initialValue: description,
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
                      validator: (value) => value == null || value.isEmpty
                          ? 'Please enter the description'
                          : null,
                      onSaved: (value) => description = value!,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      initialValue: date,
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
                      onSaved: (value) => date = value!,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      initialValue: location,
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
                      validator: (value) => value == null || value.isEmpty
                          ? 'Please enter the location'
                          : null,
                      onSaved: (value) => location = value!,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      initialValue: performers,
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
                      validator: (value) => value == null || value.isEmpty
                          ? 'Please enter the performers'
                          : null,
                      onSaved: (value) => performers = value!,
                    ),
                    const SizedBox(height: 36),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: saveUpdatedConcert,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF27405F),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Update',
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
