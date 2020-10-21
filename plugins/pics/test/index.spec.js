const plugin = require("../main");
const { expect } = require("chai");
const {
  actorFixtures,
  movieFixtures,
  studioFixtures,
  sceneFixtures,
  basicFixtures,
} = require("./fixtures/main.fixtures");

describe("pics", () => {
  describe("basic", () => {
    // eslint-disable-next-line mocha/no-setup-in-describe
    basicFixtures.forEach((fixture, fixtureIndex) => {
      it(`[${fixtureIndex}] ${fixture.name}`, async () => {
        let errored = false;

        try {
          await plugin({
            ...fixture.context,
          });
        } catch (err) {
          if (fixture.errorMessage) {
            expect(err.message.includes(fixture.errorMessage)).to.be.true;
          }
          errored = true;
        }

        if (fixture.errored) {
          expect(errored).to.equal(fixture.errored);
        }
      });
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ["actorCreated", "actorCustom"].forEach((event) => {
    describe(event, () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      actorFixtures.forEach((fixture, fixtureIndex) => {
        it(`[${fixtureIndex}] ${fixture.name}`, async () => {
          const result = await plugin({
            ...fixture.context,
            event,
          });

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
        });
      });
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ["sceneCreated", "sceneCustom"].forEach((event) => {
    describe(event, () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      sceneFixtures.forEach((fixture, fixtureIndex) => {
        it(`[${fixtureIndex}] ${fixture.name}`, async () => {
          const result = await plugin({
            ...fixture.context,
            event,
          });

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
        });
      });
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ["movieCustom"].forEach((event) => {
    describe(event, () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      movieFixtures.forEach((fixture, fixtureIndex) => {
        it(`[${fixtureIndex}] ${fixture.name}`, async () => {
          const result = await plugin({
            ...fixture.context,
            event,
          });

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
        });
      });
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ["studioCreated", "studioCustom"].forEach((event) => {
    describe(event, () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      studioFixtures.forEach((fixture, fixtureIndex) => {
        it(`[${fixtureIndex}] ${fixture.name}`, async () => {
          const result = await plugin({
            ...fixture.context,
            event,
          });

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
        });
      });
    });
  });
});
