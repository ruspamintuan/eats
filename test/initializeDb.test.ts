import { expect } from "chai";
import sinon, { SinonSpy } from "sinon";
import { initializeDb } from "../src/initializeDb"; // Assuming this file has initializeDb function
import * as db from "../src/db"; // Assuming openDb is in this file

describe("initializeDb", () => {
  let openDbStub: sinon.SinonStub;
  let dbMock: {
    serialize: sinon.SinonStub;
    run: sinon.SinonStub;
    close: sinon.SinonStub;
    get: sinon.SinonStub;
  };

  beforeEach(() => {
    // Create a mock db object with stubbed methods
    dbMock = {
      serialize: sinon.stub(),
      run: sinon.stub(),
      close: sinon.stub(),
      get: sinon.stub(),
    };

    // Stub the openDb functions
    openDbStub = sinon.stub(db, "openDb").returns(dbMock as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Check creation of table if not existing", () => {
    // Call cb function of serialize method
    dbMock.serialize.callsFake((callback) => callback());

    initializeDb();

    // openDb was called once
    expect(openDbStub.calledOnce).to.be.true;

    // run method was called with an SQL query
    expect(dbMock.run.getCall(0).args[0]).to.include("CREATE TABLE IF NOT EXISTS leads");
  });
});
