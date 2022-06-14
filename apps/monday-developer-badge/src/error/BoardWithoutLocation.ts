
class BoardWithoutLocation extends Error {
  constructor() {
    super("Board needs to have a location column.");
  }
}

export default BoardWithoutLocation;