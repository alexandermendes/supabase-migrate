const core = require('@actions/core');

const getInputs = () => ({
  fromUrl: core.getInput('fromUrl'),
  fromKey: core.getInput('fromKey'),
  toUrl: core.getInput('toUrl'),
  toUrl: core.getInput('toKey'),
});

(async () => {
  try {
    await run(getInputs());
  } catch (error) {
    core.setFailed(error.message);
  }
})();
