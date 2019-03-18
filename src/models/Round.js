export class Round {
    constructor(sessionId = '', stage = 0, admin = null, team1 = [], team2 = [], team3 = []) {
        this.sessionId = sessionId;
        this.stage = stage;
        this.admin = admin;
        this.team1 = team1;
        this.team2 = team2;
        this.team3 = team3;
    }
}
