import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:non_native/Concert.dart';
import 'package:non_native/Repository/DatabaseRepository.dart';
import 'package:non_native/Screens/AddConcert.dart';
import 'package:non_native/Screens/UpdateConcert.dart';

class ListConcerts extends StatefulWidget {
  const ListConcerts({super.key});

  @override
  State<StatefulWidget> createState() => ListConcertsState();
}

class ListConcertsState extends State<ListConcerts> {
  late DatabaseRepo _repository;
  final ValueNotifier<List<Concert>> _concertsNotifier = ValueNotifier([]);
  bool _isLoading = true;
  String? _errorMessage;

  void logConcerts() async {
    final concerts = await _repository.getConcerts();
    for (var concert in concerts) {
      debugPrint(concert.toString());
    }
  }

  @override
  void initState() {
    super.initState();
    _repository = DatabaseRepo.dbInstance;
    _initializeConcerts();
  }

  Future<void> _initializeConcerts() async {
    try {
      final concerts = await _repository.getConcerts();
      if (concerts.isEmpty) {
        debugPrint('Database empty');
        final initialConcerts =
            Concert.init();
        for (var concert in initialConcerts) {
          await _repository.add(concert);
        }
        await refreshConcerts();
        //_concertsNotifier.value =
          //  initialConcerts;
      } else {
        _concertsNotifier.value =
            concerts;
      }
    } catch (e) {
      debugPrint('Failed to initialize the concerts: $e');
      _errorMessage = e.toString();
      _showErrorSnackBar(_errorMessage!);
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteConcert(int id) async {
    try {
      await _repository.removeFromList(id);
      _concertsNotifier.value = _concertsNotifier.value
          .where((concert) => concert.id != id)
          .toList();
    } catch (e) {
      debugPrint('Failed to delete concert: $e');
      _errorMessage = e.toString();
      _showErrorSnackBar(_errorMessage!);
    }
  }

  Future<void> refreshConcerts() async {
    try {
      final concerts = await _repository.getConcerts();
      _concertsNotifier.value = concerts;
    } catch (e) {
      debugPrint("Error refreshing concerts: $e");
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

  void _showDeleteDialog(BuildContext context, int id) {
    showDialog(
      context: context,
      builder: (context) => CupertinoAlertDialog(
        title: const Text("Delete Concert"),
        content: const Text("Are you sure you want to delete this concert?"),
        actions: <Widget>[
          CupertinoDialogAction(
            child: const Text("Yes"),
            onPressed: () async {
              Navigator.of(context).pop();
              await _deleteConcert(id);
            },
          ),
          CupertinoDialogAction(
            child: const Text("No"),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Image.asset('assets/logo.png', width: 200, height: 150),
            const SizedBox(width: 50),
            const Text(
              'Discover',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, size: 36, color: Colors.white),
            onPressed: () async {
              final Concert? newConcert = await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AddConcert(
                    onConcertAdded: (concert) {
                      _concertsNotifier.value = [
                        ..._concertsNotifier.value,
                        concert
                      ];
                    },
                  ),
                ),
              );

              if (newConcert != null) {
                await _repository.add(newConcert);
              }
            },
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/confetti_background.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null
                ? Center(child: Text(_errorMessage!))
                : ValueListenableBuilder<List<Concert>>(
                    valueListenable: _concertsNotifier,
                    builder: (context, concerts, child) {
                      if (concerts.isEmpty) {
                        return const Center(
                            child: Text('No concerts available.'));
                      }
                      return ListView.builder(
                        itemCount: concerts.length,
                        itemBuilder: (context, index) {
                          return templateConcert(concerts[index]);
                        },
                      );
                    },
                  ),
      ),
    );
  }

  Widget templateConcert(Concert concert) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Stack(
        children: [
          Container(
            height: 200,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              image: const DecorationImage(
                image: AssetImage('assets/concert1_background.png'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Positioned.fill(
            child: Row(
              children: [
                Container(
                  width: MediaQuery.of(context).size.width * 0.5,
                  decoration: BoxDecoration(
                    color: const Color(0xFF081320).withOpacity(0.7),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(16),
                      bottomLeft: Radius.circular(16),
                    ),
                  ),
                  padding: const EdgeInsets.all(12),
                ),
              ],
            ),
          ),
          Positioned(
            bottom: 60,
            left: 16,
            right: 16,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      concert.name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "Date: ${DateFormat('yyyy-MM-dd').format(concert.date)}",
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      "Location: ${concert.location}",
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      "Performers: ${concert.performers.join(', ')}",
                      style: const TextStyle(color: Colors.white),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
                Row(
                  children: [
                    ElevatedButton.icon(
                      onPressed: () async {
                        Concert? updatedConcert = await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => UpdateConcert(
                              concert:
                                  concert,
                              onConcertUpdated: (updatedConcert) {
                                final updatedConcerts = [
                                  ..._concertsNotifier.value
                                ];
                                final index = updatedConcerts.indexWhere(
                                    (c) => c.id == updatedConcert.id);
                                if (index != -1) {
                                  updatedConcerts[index] = updatedConcert;
                                  _concertsNotifier.value = updatedConcerts;
                                }
                              },
                            ),
                          ),
                        );

                        if (updatedConcert != null) {
                          await _repository.update(updatedConcert);
                          await refreshConcerts();
                          debugPrint(
                              'Concert updated in the database: ${updatedConcert.id}');
                          logConcerts();
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF27405F),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      icon: const Icon(Icons.edit, size: 16),
                      label: const Text("Edit"),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () => _showDeleteDialog(context, concert.id!),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF572018),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      icon: const Icon(Icons.delete, size: 16),
                      label: const Text("Delete"),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
