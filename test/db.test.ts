import { assert, expect } from "chai";
import sinon from "sinon";
import sqlite3 from "sqlite3";
import { openDb } from "../src/db";

describe("openDb", () => {
  let dbMock: {
    run: sinon.SinonStub;
    serialize: sinon.SinonStub;
    close: sinon.SinonStub;
  };

  let sqlite3Stub: sinon.SinonStub;

  beforeEach(() => {
    dbMock = {
      run: sinon.stub(),
      serialize: sinon.stub(),
      close: sinon.stub(),
    };

    // Stub the sqlite3.Database constructor
    sqlite3Stub = sinon.stub(sqlite3, "Database").callsFake(function (_filename, _mode, callback) {
      if (callback) {
        callback(null);
      }
      return dbMock;
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Check return of SQLite database instance", () => {
    const db = openDb();

    // called with the correct arguments
    assert(sqlite3Stub.calledOnceWith("./mydb.sqlite", sqlite3.OPEN_READWRITE));

    // Check return of db to include all stubbed functions
    expect(db).to.have.all.keys(["run", "serialize", "close"]);
  });

  it("Check logging of error if there is an issue opening the database", () => {
    // Fake an error during database opening
    sqlite3Stub.callsFake(function (_filename, _mode, callback) {
      if (callback) {
        callback(new Error("Failed to open database")); // Simulate an error
      }
      return dbMock;
    });

    // Spy console log
    const consoleStub = sinon.spy(console, "log");

    openDb();

    // Check if error message was logged
    assert(consoleStub.calledWith("Error opening SQLite database:", "Failed to open database"));

    // Restore console.log after the test
    consoleStub.restore();
  });
});
