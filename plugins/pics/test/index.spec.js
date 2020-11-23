const plugin = require("../main");
const { expect } = require("chai");
const {
  actorFixtures,
  movieFixtures,
  studioFixtures,
  sceneFixtures,
  basicFixtures,
  actorCreateImageFixtures,
} = require("./fixtures/main.fixtures");

describe.only("pics", () => {
  describe("basic", () => {
    // eslint-disable-next-line mocha/no-setup-in-describe
    basicFixtures.forEach((fixture, fixtureIndex) => {
      it(`${fixtureIndex} ${fixture.name}`, async () => {
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
          if (!fixture.errored) {
            console.error(err);
          }
        }

        expect(errored).to.equal(!!fixture.errored);
      });
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ["actorCreated", "actorCustom"].forEach((event) => {
    describe(event, () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      actorFixtures.forEach((fixture, fixtureIndex) => {
        it(`${fixtureIndex} ${fixture.name}`, async () => {
          let errored = false;
          let result;

          try {
            result = await plugin({
              ...fixture.context,
              event,
            });
          } catch (err) {
            if (fixture.errorMessage) {
              expect(err.message.includes(fixture.errorMessage)).to.be.true;
            }
            errored = true;
            if (!fixture.errored) {
              console.error(err);
            }
          }

          expect(errored).to.equal(!!fixture.errored);

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
        });
      });

      // eslint-disable-next-line mocha/no-setup-in-describe
      actorCreateImageFixtures.forEach((fixture, fixtureIndex) => {
        it(`${fixtureIndex} ${fixture.name}`, async () => {
          let errored = false;
          let createImageCalled = false;
          let result;

          try {
            result = await plugin({
              ...fixture.context,
              $createLocalImage: () => {
                createImageCalled = true;
              },
              event,
            });
          } catch (err) {
            if (fixture.errorMessage) {
              expect(err.message.includes(fixture.errorMessage)).to.be.true;
            }
            errored = true;
            if (!fixture.errored) {
              console.error(err);
            }
          }

          expect(errored).to.equal(!!fixture.errored);

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
          expect(createImageCalled).to.equal(fixture.createImageCalled);
        });
      });
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ["sceneCreated", "sceneCustom"].forEach((event) => {
    describe(event, () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      sceneFixtures.forEach((fixture, fixtureIndex) => {
        it(`${fixtureIndex} ${fixture.name}`, async () => {
          let errored = false;
          let result;

          try {
            result = await plugin({
              ...fixture.context,
              event,
            });
          } catch (err) {
            if (fixture.errorMessage) {
              expect(err.message.includes(fixture.errorMessage)).to.be.true;
            }
            errored = true;
            if (!fixture.errored) {
              console.error(err);
            }
          }

          expect(errored).to.equal(!!fixture.errored);

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
        });
      });
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  ["movieCreated"].forEach((event) => {
    describe(event, () => {
      // eslint-disable-next-line mocha/no-setup-in-describe
      movieFixtures.forEach((fixture, fixtureIndex) => {
        it(`${fixtureIndex} ${fixture.name}`, async () => {
          let errored = false;
          let result;

          try {
            result = await plugin({
              ...fixture.context,
              event,
            });
          } catch (err) {
            if (fixture.errorMessage) {
              expect(err.message.includes(fixture.errorMessage)).to.be.true;
            }
            errored = true;
            if (!fixture.errored) {
              console.error(err);
            }
          }

          expect(errored).to.equal(!!fixture.errored);

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
        it(`${fixtureIndex} ${fixture.name}`, async () => {
          let errored = false;
          let result;

          try {
            result = await plugin({
              ...fixture.context,
              event,
            });
          } catch (err) {
            if (fixture.errorMessage) {
              expect(err.message.includes(fixture.errorMessage)).to.be.true;
            }
            errored = true;
            if (!fixture.errored) {
              console.error(err);
            }
          }

          expect(errored).to.equal(!!fixture.errored);

          if (fixture.result) {
            expect(result).to.be.an("object");
            expect(result).to.deep.equal(fixture.result);
          }
        });
      });
    });
  });
});
