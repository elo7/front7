let express = require('express'),
  router = express.Router(),
  fs = require('fs');

let loadSpeakers = (() => {
  let list = JSON.parse(fs.readFileSync('data/speakers.json', 'utf8')),
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

router.get('/palestrante/:link', (req, res) => {
  res.render('speaker', {speaker: loadSpeakers.getSpeakerByName(req.params.link)});
});

router.get('/eventos', (req, res) => {
  res.render('events');
});

module.exports = router;
