export default class UserDtoSteam {
  steamID;
  id;
  displayName;
  identifier;

  constructor(model) {
    this.steamID = model.steamID;
    this.id = model._id;
    this.displayName = model.displayName;
    this.identifier = model.identifier;
  }
}

