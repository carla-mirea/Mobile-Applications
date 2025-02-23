class Concert {
    constructor(id, name, description, date, location, performers) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.date = date;
      this.location = location;
      this.performers = performers;
    }
  
    static fromDbRow(row) {
        return new Concert(
          row.id,
          row.name,
          row.description,
          row.date,
          row.location,
          Array.isArray(row.performers) 
            ? row.performers 
            : row.performers.split(',').map((p) => p.trim())
        );
      }
  
    toDbRow() {
      return {
        id: this.id,
        name: this.name,
        description: this.description,
        date: this.date,
        location: this.location,
        performers: this.performers.join(', '),
      };
    }

    toJSON() {
        return {
          id: this.id,
          name: this.name,
          description: this.description,
          date: this.date,
          location: this.location,
          performers: Array.isArray(this.performers) ? this.performers : [],
        };
    }
}
  
  module.exports = Concert;