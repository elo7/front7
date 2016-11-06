let express = require('express'),
  router = express.Router(),
  fs = require('fs');

let loadSpeakers = (() => {
  let list = JSON.parse(fs.readFileSync('speakers.json', 'utf8')),
    speakers = list.speakers,
    currentSpeakers = [];

  return {
    getSpeakers: speakers,
    getCurrentSpeakers: speakers.filter((s) => s.current),
    getSpeakerByName(name) {
      return speakers.filter((s) => s.link === name);
    }
  }
})();

router.get(['/', 'index.html'], (req, res) => {
	res.render('index', {speakers: loadSpeakers.getCurrentSpeakers});
});

router.get('/speaker/:link', (req, res) => {
  res.render('speaker', {speaker: loadSpeakers.getSpeakerByName(req.params.link)});
});

module.exports = router;
