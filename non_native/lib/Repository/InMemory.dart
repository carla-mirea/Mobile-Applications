import 'package:non_native/Concert.dart';

class InMemory {
  List<Concert> concerts = Concert.init();

  Concert? getConcertById(int id) {
    for (Concert c in concerts) {
      if (c.id == id) return c;
    }
    return null;
  }

  void update(Concert newConcert) {
    for (int i = 0; i < concerts.length; i++) {
      if (concerts[i].id == newConcert.id) {
        concerts[i] = newConcert;
      }
    }
  }

  void add(Concert c) {
    concerts.add(c);
  }

  void removeFromList(int id) {
    concerts.removeWhere((element) => element.id == id);
  }
  
}
